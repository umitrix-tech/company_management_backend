const prisma = require("../../prisma");
const AppError = require("../utils/AppError");

class SalaryService {
  /**
   * SALARY TEMPLATES
   */
  async createTemplate(companyId, data) {
    const { name, components } = data;
    const template = await prisma.salaryTemplate.create({
      data: {
        name,
        companyId,
      },
    });

    if (components && components.length > 0) {
      await prisma.templateComponent.createMany({
        data: components.map((c) => ({
          templateId: template.id,
          name: c.name,
          componentType: c.componentType,
          valueType: c.valueType,
          value: c.value,
          order: c.order,
        })),
      });
    }

    return await prisma.salaryTemplate.findUnique({
      where: { id: template.id },
      include: { components: true },
    });
  }

  async getTemplates(companyId) {
    return await prisma.salaryTemplate.findMany({
      where: { companyId },
      include: { components: true },
    });
  }

  async updateTemplate(id, data) {
    const { name, components } = data;
    
    if (components) {
      await prisma.templateComponent.deleteMany({
        where: { templateId: id },
      });
    }

    return await prisma.salaryTemplate.update({
      where: { id },
      data: {
        name,
        ...(components && {
          components: {
            create: components.map((c) => ({
              name: c.name,
              componentType: c.componentType,
              valueType: c.valueType,
              value: c.value,
              order: c.order,
            })),
          },
        }),
      },
      include: { components: true },
    });
  }

  async deleteTemplate(id) {
    await prisma.templateComponent.deleteMany({ where: { templateId: id } });
    return await prisma.salaryTemplate.delete({ where: { id } });
  }

  /**
   * EMPLOYEE SALARY
   */
  async assignSalaryToEmployee(companyId, userId, data) {
    const {
      templateId,
      salaryMode,
      baseSalary,
      workingDaysPerMonth,
      workingHoursPerDay,
      effectiveFrom,
      components,
    } = data;

    await prisma.employeeSalary.updateMany({
      where: { userId: Number(userId), isActive: true },
      data: { isActive: false, effectiveTo: new Date() },
    });

    let finalComponents = [];
    if (templateId && !components) {
      const template = await prisma.salaryTemplate.findUnique({
        where: { id: templateId },
        include: { components: true },
      });
      if (!template) throw new AppError("Template not found", 404);
      finalComponents = template.components.map((c) => ({
        name: c.name,
        componentType: c.componentType,
        valueType: c.valueType,
        value: c.value,
        order: c.order,
      }));
    } else if (components) {
      finalComponents = components;
    }

    const salary = await prisma.employeeSalary.create({
      data: {
        userId: Number(userId),
        companyId,
        templateId,
        salaryMode,
        baseSalary,
        workingDaysPerMonth,
        workingHoursPerDay,
        effectiveFrom: new Date(effectiveFrom),
        isActive: true,
      },
    });

    if (finalComponents && finalComponents.length > 0) {
      await prisma.salaryComponent.createMany({
        data: finalComponents.map((c) => ({
          salaryId: salary.id,
          name: c.name,
          componentType: c.componentType,
          valueType: c.valueType,
          value: c.value,
          order: c.order,
        })),
      });
    }

    return await prisma.employeeSalary.findUnique({
      where: { id: salary.id },
      include: { components: true },
    });
  }

  async getEmployeeSalaryHistory(userId) {
    return await prisma.employeeSalary.findMany({
      where: { userId: Number(userId) },
      include: { components: true },
      orderBy: { effectiveFrom: "desc" },
    });
  }

  /**
   * LOANS
   */
  async createLoan(companyId, userId, data) {
    const { principalAmount, interestRate, tenureMonths, disbursedAt, olderLoanId } = data;

    // If there's an older loan to close
    if (olderLoanId) {
      const oldLoan = await prisma.loan.findUnique({ where: { id: Number(olderLoanId) } });
      if (oldLoan && oldLoan.status !== "COMPLETED") {
          await prisma.loanRepayment.create({
            data: {
              loan: { connect: { id: oldLoan.id } },
              amount: oldLoan.remainingAmount,
            },
          });
          await prisma.loan.update({
            where: { id: oldLoan.id },
            data: {
              remainingAmount: 0,
              status: "COMPLETED",
            },
          });
      }
    }

    const monthlyRate = interestRate / 12 / 100;
    const emiAmount =
      (principalAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    const totalRepayable = emiAmount * tenureMonths;

    return await prisma.loan.create({
      data: {
        companyId,
        userId: Number(userId),
        principalAmount,
        interestRate,
        tenureMonths,
        olderPaymentId: olderLoanId ? Number(olderLoanId) : null,
        emiAmount: Math.round(emiAmount * 100) / 100,
        totalRepayable: Math.round(totalRepayable * 100) / 100,
        remainingAmount: Math.round(totalRepayable * 100) / 100,
        status: "ACTIVE",
        disbursedAt: disbursedAt ? new Date(disbursedAt) : new Date(),
      },
    });
  }

  async getLoans(companyId, query) {
    const { month, year, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = { companyId };
    
    const [loans, total] = await Promise.all([
      prisma.loan.findMany({
        where,
        include: {
          user: {
            select: { name: true, empCode: true }
          },
          repayments: {
            where: {
              salarySlip: {
                month: Number(month),
                year: Number(year)
              }
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { disbursedAt: "desc" }
      }),
      prisma.loan.count({ where })
    ]);

    // Format the response with status for the specific month
    const formattedLoans = await Promise.all(loans.map(async (loan) => {
      // Check if there's a salary slip for this user in this month to enable "slip download"
      const slip = await prisma.salarySlip.findUnique({
        where: {
          userId_month_year: {
            userId: loan.userId,
            month: Number(month),
            year: Number(year)
          }
        },
        select: { id: true }
      });

      return {
        id: loan.id,
        name: loan.user.name,
        empCode: loan.user.empCode,
        loanStatus: loan.status, // ACTIVE / COMPLETED
        monthStatus: loan.repayments.length > 0 ? "CLEARED" : "PENDING",
        slipId: slip ? slip.id : null,
        principalAmount: loan.principalAmount,
        emiAmount: loan.emiAmount,
        remainingAmount: loan.remainingAmount
      };
    }));

    return {
      data: formattedLoans,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getLoanStats(companyId, month, year) {
    // 1. Monthly collected amount
    const monthlyRepayments = await prisma.loanRepayment.aggregate({
      where: {
        loan: { companyId },
        salarySlip: { month: Number(month), year: Number(year) }
      },
      _sum: { amount: true }
    });

    // 2. Overall stats
    const overallStats = await prisma.loan.aggregate({
      where: { companyId },
      _sum: {
        totalRepayable: true,
        remainingAmount: true
      },
      _count: { id: true }
    });

    return {
      monthTotalLoanCollectAmount: monthlyRepayments._sum.amount || 0,
      pendingAmount: overallStats._sum.remainingAmount || 0,
      overallLoanAmount: overallStats._sum.totalRepayable || 0,
      overallLoanCount: overallStats._count.id || 0,
      overallLoanPendingAmount: overallStats._sum.remainingAmount || 0,
    };
  }

  async processLoanAction(loanId, data) {
    const { action, amount } = data;
    const loan = await prisma.loan.findUnique({ where: { id: Number(loanId) } });
    if (!loan) throw new AppError("Loan not found", 404);

    let updatedLoan;

    switch (action) {
      case "PRE_CLOSE":
        // Pay the full remaining amount
        const preCloseAmount = loan.remainingAmount;
        await prisma.loanRepayment.create({
          data: {
            loan: { connect: { id: loan.id } },
            amount: preCloseAmount,
          },
        });
        updatedLoan = await prisma.loan.update({
          where: { id: loan.id },
          data: {
            remainingAmount: 0,
            status: "COMPLETED",
          },
        });
        break;

      case "HOLD":
        updatedLoan = await prisma.loan.update({
          where: { id: loan.id },
          data: { status: "HELD" },
        });
        break;

      case "RESUME":
        updatedLoan = await prisma.loan.update({
          where: { id: loan.id },
          data: { status: "ACTIVE" },
        });
        break;

      case "PARTIAL_PAYMENT":
        if (!amount || amount <= 0) throw new AppError("Valid amount is required for partial payment", 400);
        const paymentAmount = Math.min(amount, loan.remainingAmount);
        await prisma.loanRepayment.create({
          data: {
            loan: { connect: { id: loan.id } },
            amount: paymentAmount,
          },
        });
        const newRemaining = loan.remainingAmount - paymentAmount;
        updatedLoan = await prisma.loan.update({
          where: { id: loan.id },
          data: {
            remainingAmount: newRemaining,
            status: newRemaining <= 0 ? "COMPLETED" : loan.status,
          },
        });
        break;

      default:
        throw new AppError("Invalid loan action", 400);
    }

    return updatedLoan;
  }

  /**
   * ADJUSTMENTS
   */
  async addAdjustment(companyId, userId, data) {
    const { name, componentType, amount, month, year } = data;
    return await prisma.salaryAdjustment.create({
      data: {
        companyId,
        userId: Number(userId),
        name,
        componentType,
        amount,
        month,
        year,
      },
    });
  }

  /**
   * SALARY SLIP GENERATION
   */
  async generateSalarySlip(companyId, userId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const salaries = await prisma.employeeSalary.findMany({
      where: {
        userId: Number(userId),
        OR: [
          { effectiveTo: null, effectiveFrom: { lte: endDate } },
          { effectiveFrom: { lte: endDate }, effectiveTo: { gte: startDate } },
        ],
      },
      include: { components: true },
    });

    if (salaries.length === 0) throw new AppError("No active salary found for this period", 404);

    let totalGross = 0;
    let totalDeduction = 0;
    let slipComponents = [];

    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        userId: Number(userId),
        date: { gte: startDate, lte: endDate },
      },
    });

    for (const salary of salaries) {
      const periodStart = salary.effectiveFrom > startDate ? salary.effectiveFrom : startDate;
      const periodEnd = (salary.effectiveTo && salary.effectiveTo < endDate) ? salary.effectiveTo : endDate;
      
      const daysInPeriod = Math.ceil((periodEnd - periodStart) / (1000 * 60 * 60 * 24)) + 1;
      
      const periodAttendance = attendanceRecords.filter(a => a.date >= periodStart && a.date <= periodEnd);
      const presentDays = periodAttendance.filter(a => a.isPresent).length;
      const totalHoursWorked = periodAttendance.reduce((sum, a) => sum + (a.hoursWorked || 0), 0);

      let periodBasePay = 0;
      if (salary.salaryMode === "MONTHLY") {
        const daysInMonth = new Date(year, month, 0).getDate();
        const workingDays = salary.workingDaysPerMonth || daysInMonth;
        periodBasePay = (salary.baseSalary / workingDays) * presentDays;
      } else if (salary.salaryMode === "DAILY") {
        periodBasePay = salary.baseSalary * presentDays;
      } else if (salary.salaryMode === "HOURLY") {
        periodBasePay = salary.baseSalary * totalHoursWorked;
      }

      totalGross += periodBasePay;
      slipComponents.push({
        name: `Base Pay (${salary.salaryMode})`,
        componentType: "EARNING",
        valueType: "FIXED",
        value: salary.baseSalary,
        amount: periodBasePay
      });

      for (const comp of salary.components) {
        let amount = 0;
        if (comp.valueType === "FIXED") {
          if (salary.salaryMode === "MONTHLY") {
            const daysInMonth = new Date(year, month, 0).getDate();
            const workingDays = salary.workingDaysPerMonth || daysInMonth;
            amount = (comp.value / workingDays) * presentDays;
          } else {
             const daysInMonth = new Date(year, month, 0).getDate();
             amount = (comp.value / daysInMonth) * daysInPeriod; 
          }
        } else if (comp.valueType === "PERCENTAGE") {
          amount = (periodBasePay * comp.value) / 100;
        }

        if (comp.componentType === "EARNING") {
          totalGross += amount;
        } else {
          totalDeduction += amount;
        }

        slipComponents.push({
          name: comp.name,
          componentType: comp.componentType,
          valueType: comp.valueType,
          value: comp.value,
          amount: amount
        });
      }
    }

    const adjustments = await prisma.salaryAdjustment.findMany({
      where: { userId: Number(userId), month, year },
    });

    for (const adj of adjustments) {
      if (adj.componentType === "EARNING") {
        totalGross += adj.amount;
      } else {
        totalDeduction += adj.amount;
      }
      slipComponents.push({
        name: adj.name,
        componentType: adj.componentType,
        valueType: "FIXED",
        value: adj.amount,
        amount: adj.amount
      });
    }

    const activeLoans = await prisma.loan.findMany({
      where: { userId: Number(userId), status: "ACTIVE" },
    });

    let loanRepaymentsData = [];

    for (const loan of activeLoans) {
      const deduction = Math.min(loan.emiAmount, loan.remainingAmount);
      totalDeduction += deduction;
      
      slipComponents.push({
        name: `Loan EMI Deduction (Loan #${loan.id})`,
        componentType: "DEDUCTION",
        valueType: "FIXED",
        value: deduction,
        amount: deduction
      });

      loanRepaymentsData.push({
        loanId: loan.id,
        amount: deduction
      });
    }

    const netPay = totalGross - totalDeduction;

    const slip = await prisma.salarySlip.create({
      data: {
        userId: Number(userId),
        companyId,
        salaryId: salaries[0].id,
        month,
        year,
        grossAmount: totalGross,
        totalDeduction,
        netPay,
      },
    });

    if (slipComponents && slipComponents.length > 0) {
      await prisma.salarySlipComponent.createMany({
        data: slipComponents.map((c) => ({
          salarySlipId: slip.id,
          name: c.name,
          componentType: c.componentType,
          valueType: c.valueType,
          value: c.value,
          amount: c.amount,
        })),
      });
    }

    for (const rep of loanRepaymentsData) {
      await prisma.loanRepayment.create({
        data: {
          loan: { connect: { id: rep.loanId } },
          salarySlip: { connect: { id: slip.id } },
          amount: rep.amount
        }
      });

      const updatedRemaining = await prisma.loan.findUnique({ where: { id: rep.loanId } });
      const newRemaining = updatedRemaining.remainingAmount - rep.amount;
      await prisma.loan.update({
        where: { id: rep.loanId },
        data: { 
          remainingAmount: newRemaining,
          status: newRemaining <= 0 ? "COMPLETED" : "ACTIVE"
        }
      });
    }

    return slip;
  }
}

module.exports = new SalaryService();

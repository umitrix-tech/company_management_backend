const salaryService = require("../src/service/salary.service");
const prisma = require("@umitrix/database");

async function verifySalary() {
  console.log("Starting Salary Verification...");

  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log("No user found in DB. Please create a user first.");
      return;
    }
    const companyId = user.companyId;

    // CLEANUP: Delete existing records for this month to avoid unique constraint violations
    console.log("Cleaning up existing records for March 2025...");
    await prisma.salarySlipComponent.deleteMany({
        where: { salarySlip: { userId: user.id, month: 3, year: 2025 } }
    });
    await prisma.loanRepayment.deleteMany({
        where: { salarySlip: { userId: user.id, month: 3, year: 2025 } }
    });
    await prisma.salarySlip.deleteMany({
        where: { userId: user.id, month: 3, year: 2025 }
    });
    // Optional: Delete adjustments too
    await prisma.salaryAdjustment.deleteMany({
        where: { userId: user.id, month: 3, year: 2025 }
    });

    console.log("Creating Salary Template...");
    const template = await salaryService.createTemplate(companyId, {
      name: "Standard Tech Stack " + Date.now(),
      components: [
        { name: "HRA", componentType: "EARNING", valueType: "PERCENTAGE", value: 40, order: 1 },
        { name: "PF", componentType: "DEDUCTION", valueType: "PERCENTAGE", value: 12, order: 2 },
        { name: "Professional Tax", componentType: "DEDUCTION", valueType: "FIXED", value: 200, order: 3 },
      ]
    });

    console.log("Assigning Daily Salary...");
    await salaryService.assignSalaryToEmployee(companyId, user.id, {
      salaryMode: "DAILY",
      baseSalary: 2000,
      effectiveFrom: new Date(2025, 2, 1),
    });

    console.log("Switching to Monthly Salary...");
    await salaryService.assignSalaryToEmployee(companyId, user.id, {
      templateId: template.id,
      salaryMode: "MONTHLY",
      baseSalary: 60000,
      workingDaysPerMonth: 30,
      effectiveFrom: new Date(2025, 2, 16),
    });

    console.log("Adding Attendance...");
    for (let i = 1; i <= 10; i++) {
        await prisma.attendance.upsert({
            where: { userId_date: { userId: user.id, date: new Date(2025, 2, i) } },
            update: { isPresent: true },
            create: { userId: user.id, companyId, date: new Date(2025, 2, i), isPresent: true }
        });
    }
    for (let i = 16; i <= 30; i++) {
        await prisma.attendance.upsert({
            where: { userId_date: { userId: user.id, date: new Date(2025, 2, i) } },
            update: { isPresent: true },
            create: { userId: user.id, companyId, date: new Date(2025, 2, i), isPresent: true }
        });
    }

    console.log("Adding Loan...");
    const loan = await salaryService.createLoan(companyId, user.id, {
        principalAmount: 50000,
        interestRate: 10,
        tenureMonths: 10,
        disbursedAt: new Date(2025, 1, 15)
    });

    console.log("Generating Salary Slip for March 2025...");
    const slip = await salaryService.generateSalarySlip(companyId, user.id, 3, 2025);
    
    console.log("--- Salary Slip Result ---");
    console.log("Gross:", slip.grossAmount);
    console.log("Deductions:", slip.totalDeduction);
    console.log("Net Pay:", slip.netPay);
    
    const slipWithComponents = await prisma.salarySlip.findUnique({
        where: { id: slip.id },
        include: { components: true }
    });
    console.log("Components:");
    slipWithComponents.components.forEach(c => {
        console.log(` - ${c.name}: ${c.amount}`);
    });

    const updatedLoan = await prisma.loan.findUnique({ where: { id: loan.id } });
    console.log("Loan Remaining Balance:", updatedLoan.remainingAmount);

  } catch (error) {
    console.error("Verification failed:", error);
    if (error.cause) console.error("Cause:", error.cause);
    if (error.meta) console.error("Meta:", error.meta);
  } finally {
    await prisma.$disconnect();
  }
}

verifySalary();

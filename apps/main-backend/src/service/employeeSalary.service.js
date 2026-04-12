const prisma = require("@umitrix/database");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

/**
 * SETUP EMPLOYEE SALARY (Composite Transaction)
 */
const setupEmployeeSalaryService = async (payload, user) => {
  try {
    const {
      userId,
      taxSlabId,
      standardDeduction,
      declared80C,
      salaryMode,
      effectiveFrom,
      templateId,
      components,
      isFirstSalary,
      oldSalary,
      newSalary,
    } = payload;

    return await prisma.$transaction(async (tx) => {
      // 1. Update/Create EmployeeTaxConfig
      // We search for an existing one that is active or just create/update the latest
      const existingTaxConfig = await tx.employeeTaxConfig.findFirst({
        where: { userId: Number(userId), companyId: user.companyId, isDeleted: false },
        orderBy: { effectiveFrom: "desc" },
      });

      if (existingTaxConfig) {
        await tx.employeeTaxConfig.update({
          where: { id: existingTaxConfig.id },
          data: {
            taxSlabId: Number(taxSlabId),
            standardDeduction,
            declared80C,
            effectiveFrom: new Date(effectiveFrom),
          },
        });
      } else {
        await tx.employeeTaxConfig.create({
          data: {
            userId: Number(userId),
            taxSlabId: Number(taxSlabId),
            standardDeduction,
            declared80C,
            effectiveFrom: new Date(effectiveFrom),
            companyId: user.companyId,
          },
        });
      }

      // 2. Close previous EmployeeSalary
      await tx.employeeSalary.updateMany({
        where: { userId: Number(userId), companyId: user.companyId, isActive: true, isDeleted: false },
        data: { isActive: false, effectiveTo: new Date(effectiveFrom) },
      });

      // 3. Create new EmployeeSalary
      const newSalaryRecord = await tx.employeeSalary.create({
        data: {
          userId: Number(userId),
          companyId: user.companyId,
          templateId: templateId ? Number(templateId) : null,
          salaryMode,
          effectiveFrom: new Date(effectiveFrom),
          isActive: true,
          components: {
            create: components ? components.map((c) => ({
              name: c.name,
              code: c.code,
              componentType: c.componentType,
              valueType: c.valueType,
              value: c.value,
              formula: c.formula,
              isTaxable: c.isTaxable !== undefined ? c.isTaxable : true,
              order: c.order,
            })) : [],
          },
        },
        include: {
          components: true,
        },
      });

      // 4. Create SalaryHistory
      await tx.salaryHistory.create({
        data: {
          userId: Number(userId),
          companyId: user.companyId,
          oldSalary: Number(oldSalary) || 0,
          newSalary: Number(newSalary),
          changeType: isFirstSalary ? "FIRST_SALARY" : "HIKE", // Simple logic for now
          effectiveDate: new Date(effectiveFrom),
        },
      });

      return newSalaryRecord;
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * GET ACTIVE SALARY DETAILS
 */
const getEmployeeSalaryDetailsService = async (userId, user) => {
  try {
    const salary = await prisma.employeeSalary.findFirst({
      where: {
        userId: Number(userId),
        companyId: user.companyId,
        isActive: true,
        isDeleted: false,
      },
      include: {
        components: true,
        template: {
          include: {
            components: true,
          },
        },
      },
    });

    const taxConfig = await prisma.employeeTaxConfig.findFirst({
      where: {
        userId: Number(userId),
        companyId: user.companyId,
        isDeleted: false,
      },
      include: {
        taxSlab: {
          include: {
            slabs: true,
          },
        },
      },
      orderBy: { effectiveFrom: "desc" },
    });

    return {
      salary,
      taxConfig,
    };
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * LIST SALARY HISTORY
 */
const listSalaryHistoryService = async (query, user) => {
  try {
    const { userId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = {
      companyId: user.companyId,
      ...(userId && { userId: Number(userId) }),
    };

    const [data, total] = await Promise.all([
      prisma.salaryHistory.findMany({
        where,
        orderBy: { effectiveDate: "desc" },
        skip: Number(skip),
        take: Number(limit),
        include: {
          user: {
            select: { name: true, empCode: true },
          },
        },
      }),
      prisma.salaryHistory.count({ where }),
    ]);

    return {
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

module.exports = {
  setupEmployeeSalaryService,
  getEmployeeSalaryDetailsService,
  listSalaryHistoryService,
};

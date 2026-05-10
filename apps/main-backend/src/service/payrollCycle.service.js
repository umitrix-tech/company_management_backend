const prisma = require("@umitrix/database");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

const createPayrollCycleService = async (payload, user) => {
  try {
    const { name, startDate, endDate, payoutDate, status } = payload;
    return await prisma.payrollCycle.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        payoutDate: new Date(payoutDate),
        status: status || "OPEN",
        companyId: user.companyId,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

const updatePayrollCycleService = async (payload, user) => {
  try {
    const { id, name, startDate, endDate, payoutDate, status } = payload;

    const existing = await prisma.payrollCycle.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!existing) {
      throw new AppError("Payroll cycle not found", 404);
    }

    return await prisma.payrollCycle.update({
      where: { id: Number(id) },
      data: {
        name,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        payoutDate: payoutDate ? new Date(payoutDate) : undefined,
        status,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

const deletePayrollCycleService = async (id, user) => {
  try {
    const existing = await prisma.payrollCycle.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!existing) {
      throw new AppError("Payroll cycle not found", 404);
    }

    return await prisma.payrollCycle.delete({
      where: { id: Number(id) },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

const getPayrollCycleService = async (id, user) => {
  try {
    const data = await prisma.payrollCycle.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!data) {
      throw new AppError("Payroll cycle not found", 404);
    }

    return data;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

const listPayrollCycleService = async (query, user) => {
  try {
    const { page = 1, limit = 10, search = "" } = query;
    const skip = (page - 1) * limit;

    const where = {
      companyId: user.companyId,
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    };

    const [data, total] = await Promise.all([
      prisma.payrollCycle.findMany({
        where,
        orderBy: [{ id: "desc" }],
        skip: Number(skip),
        take: Number(limit),
      }),
      prisma.payrollCycle.count({ where }),
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
  createPayrollCycleService,
  updatePayrollCycleService,
  deletePayrollCycleService,
  getPayrollCycleService,
  listPayrollCycleService,
};

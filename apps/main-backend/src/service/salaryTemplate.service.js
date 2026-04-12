const prisma = require("@umitrix/database");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

/**
 * CREATE
 */
const createSalaryTemplateService = async (payload, user) => {
  try {
    const { name, components } = payload;

    return await prisma.salaryTemplate.create({
      data: {
        name,
        companyId: user.companyId,
        components: {
          create: components.map((c) => ({
            name: c.name,
            code: c.code,
            componentType: c.componentType,
            valueType: c.valueType,
            value: c.value,
            formula: c.formula,
            isTaxable: c.isTaxable != undefined ? c.isTaxable : false,
            order: c.order,
          })),
        },
      },
      include: {
        components: true,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * UPDATE
 */
const updateSalaryTemplateService = async (payload, user) => {
  try {
    const { id, name, components } = payload;

    const existing = await prisma.salaryTemplate.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
        isDeleted: false,
      },
    });

    if (!existing) {
      throw new AppError("Salary template not found", 404);
    }

    return await prisma.$transaction(async (tx) => {
      // Update head
      const updatedTemplate = await tx.salaryTemplate.update({
        where: { id: Number(id) },
        data: {
          name,
        },
      });

      // Update components if provided
      if (components) {
        // Delete existing components
        await tx.templateComponent.deleteMany({
          where: { templateId: Number(id) },
        });

        // Create new components
        await tx.templateComponent.createMany({
          data: components.map((c) => ({
            templateId: Number(id),
            name: c.name,
            code: c.code,
            componentType: c.componentType,
            valueType: c.valueType,
            value: c.value,
            formula: c.formula,
            isTaxable: c.isTaxable != undefined ? c.isTaxable : false,
            order: c.order,
          })),
        });
      }

      return await tx.salaryTemplate.findUnique({
        where: { id: Number(id) },
        include: { components: true },
      });
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * DELETE (Soft Delete)
 */
const deleteSalaryTemplateService = async (id, user) => {
  try {
    const existing = await prisma.salaryTemplate.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
        isDeleted: false,
      },
    });

    if (!existing) {
      throw new AppError("Salary template not found", 404);
    }

    // Mark as deleted
    return await prisma.salaryTemplate.update({
      where: { id: Number(id) },
      data: { isDeleted: true },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * GET BY ID
 */
const getSalaryTemplateService = async (id, user) => {
  try {
    const data = await prisma.salaryTemplate.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
        isDeleted: false,
      },
      include: {
        components: true,
      },
    });

    if (!data) {
      throw new AppError("Salary template not found", 404);
    }

    return data;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * LIST
 */
const listSalaryTemplatesService = async (query, user) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where = {
      companyId: user.companyId,
      isDeleted: false,
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.salaryTemplate.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: Number(skip),
        take: Number(limit),
        include: {
          components: true,
        },
      }),
      prisma.salaryTemplate.count({ where }),
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
  createSalaryTemplateService,
  updateSalaryTemplateService,
  deleteSalaryTemplateService,
  getSalaryTemplateService,
  listSalaryTemplatesService,
};

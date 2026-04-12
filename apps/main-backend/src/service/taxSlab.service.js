const prisma = require("@umitrix/database");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

/**
 * CREATE
 */
const createTaxSlabService = async (payload, user, res) => {
  try {
    const { financialYear, slabs, regime, skipPopUp } = payload;

    if (skipPopUp == false) {
      const existing = await prisma.taxSlab.findFirst({
        where: {
          isDeleted: false,
          regime: {
            contains: regime,
            mode: "insensitive"
          }
        }
      })

      if (existing && existing.regime.toLowerCase() == regime.toLowerCase()) {
        res.status(201).json({ message: "Already same name is there !", code: 1200, data: existing });
      }

      if (existing) {
        res.status(201).json({ message: "Already matching name is there !", code: 1201, data: existing });
      }
    }


    return await prisma.taxSlab.create({
      data: {
        financialYear,
        companyId: user.companyId,
        regime: regime,
        slabs: {
          create: slabs.map((slab) => ({
            minIncome: slab.minIncome,
            maxIncome: slab.maxIncome,
            taxRate: slab.taxRate,
          })),
        },
      },
      include: {
        slabs: true,
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * UPDATE
 */
const updateTaxSlabService = async (payload, user) => {
  try {
    const { id, financialYear, slabs, regime } = payload;

    const existing = await prisma.taxSlab.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!existing) {
      throw new AppError("Tax slab not found", 404);
    }

    return await prisma.$transaction(async (tx) => {
      // Update head
      const updatedTaxSlab = await tx.taxSlab.update({
        where: { id: Number(id) },
        data: {
          regime,
          financialYear,
        },
      });

      // Update slabs if provided
      if (slabs) {
        // Delete existing slabs
        await tx.slabs.deleteMany({
          where: { taxSlabId: Number(id) },
        });

        // Create new slabs
        await tx.slabs.createMany({
          data: slabs.map((slab) => ({
            taxSlabId: Number(id),
            minIncome: slab.minIncome,
            maxIncome: slab.maxIncome,
            taxRate: slab.taxRate,
          })),
        });
      }

      return await tx.taxSlab.findUnique({
        where: { id: Number(id) },
        include: { slabs: true },
      });
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * DELETE
 */
const deleteTaxSlabService = async (id, user) => {
  try {
    const existing = await prisma.taxSlab.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!existing) {
      throw new AppError("Tax slab not found", 404);
    }

    const employeeTaxConfig = await prisma.employeeTaxConfig.findFirst({
      where: {
        taxSlabId: Number(id),
        companyId: user.companyId,
      },
    });

    if (employeeTaxConfig) {
      throw new AppError("Tax slab is already used in employee tax config", 400);
    }

    // slabs are deleted automatically due to onDelete: Cascade in schema
    return await prisma.taxSlab.update({
      where: {
        id: Number(id)
      },
      data: {
        isDeleted: true
      }
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * GET BY ID
 */
const getTaxSlabService = async (id, user) => {
  try {
    const data = await prisma.taxSlab.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
        isDeleted: false
      },
      include: {
        slabs: true,
      },
    });

    if (!data) {
      throw new AppError("Tax slab not found", 404);
    }

    return data;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * LIST
 */
const listTaxSlabService = async (query, user) => {
  try {
    const {
      financialYear,
      page = 1,
      search = "",
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where = {
      companyId: user.companyId,
      ...(financialYear && { financialYear }),
      ...(search && { regime: { contains: search, mode: "insensitive" } }),
      isDeleted: false
    };

    const [data, total] = await Promise.all([
      prisma.taxSlab.findMany({
        where,
        orderBy: [{ financialYear: "desc" }],
        skip: Number(skip),
        take: Number(limit),
        include: {
          slabs: true,
        },
      }),
      prisma.taxSlab.count({ where }),
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
  createTaxSlabService,
  updateTaxSlabService,
  deleteTaxSlabService,
  getTaxSlabService,
  listTaxSlabService,
};

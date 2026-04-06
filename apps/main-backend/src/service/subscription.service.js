const prisma = require("@umitrix/database");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

/**
 * Create a new subscription (PlanHistory)
 * This will deactivate existing plans for the company and create a new one.
 */
const createSubscriptionService = async (data, user) => {
  try {
    const { tierOfPlan, startDate, endDate } = data;
    const companyId = data.companyId || user.companyId;

    if (!companyId) {
      throw new AppError("Company ID is required", 400);
    }

    // Start a transaction to ensure atomic updates with a custom timeout
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deactivate all existing plans for this company
      await tx.planHistory.updateMany({
        where: {
          companyId: parseInt(companyId),
          isActive: true
        },
        data: {
          isActive: false
        }
      });

      // 2. Create the new subscription
      const newSubscription = await tx.planHistory.create({
        data: {
          tierOfPlan,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          companyId: parseInt(companyId),
          isActive: true
        }
      });

      return newSubscription;
    }, {
      maxWait: 10000, // Maximum time for the Prisma Client to wait for a transaction to be available
      timeout: 20000  // Maximum time the transaction can run before it is canceled
    });

    return result;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * List all subscriptions (PlanHistory) for a company
 */
const listSubscriptionService = async (query, user) => {
  try {
    const { companyId } = user;
    const {
      page = 1,
      limit = 10,
      tierOfPlan,
      isActive
    } = query;

    if (!companyId) {
      throw new AppError("Company ID not found", 400);
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      companyId: parseInt(companyId)
    };

    if (tierOfPlan) {
      where.tierOfPlan = tierOfPlan;
    }

    if (isActive !== undefined) {
      where.isActive = (isActive === 'true' || isActive === true);
    }

    const [data, total] = await Promise.all([
      prisma.planHistory.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: {
          id: 'desc'
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.planHistory.count({ where })
    ]);

    return {
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

module.exports = {
  createSubscriptionService,
  listSubscriptionService
};

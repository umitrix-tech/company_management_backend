const prisma = require("../../prisma");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

/**
 * Get current active plan for the company
 */
const getPlanHistoryService = async (user) => {
  try {
    const { companyId } = user;

    if (!companyId) {
      throw new AppError("Company ID not found", 400);
    }

    const plan = await prisma.planHistory.findFirst({
      where: { 
        companyId: parseInt(companyId),
        isActive: true 
      },
      orderBy: {
        id: 'desc' // Changed from createdAt to id
      }
    });

    if (!plan) {
      throw new AppError("No active plan found for this company", 404);
    }

    return plan;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * Get plan history by ID
 */
const getPlanHistoryByIdService = async (id, user) => {
  try {
    const { companyId } = user;

    if (!id) {
      throw new AppError("Plan history ID is required", 400);
    }

    const plan = await prisma.planHistory.findFirst({
      where: {
        id: parseInt(id),
        companyId: parseInt(companyId)
      }
    });

    if (!plan) {
      throw new AppError("Plan history not found", 404);
    }

    return plan;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * List all plan history with pagination and filters
 */
const listPlanHistoryService = async (query, user) => {
  try {
    const { companyId } = user;
    const {
      page = 1,
      limit = 10,
      isActive,
      tierOfPlan,
      startDate,
      endDate,
      sortBy = 'id', // Changed default from 'createdAt' to 'id'
      sortOrder = 'desc'
    } = query;

    if (!companyId) {
      throw new AppError("Company ID not found", 400);
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      companyId: parseInt(companyId)
    };

    // Filter by active status
    if (isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true';
    }

    // Filter by plan tier
    if (tierOfPlan) {
      where.tierOfPlan = tierOfPlan;
    }

    if (startDate || endDate) {

      if (startDate) {
        console.log('Start date filter:', startDate);
      }
      if (endDate) {
        console.log('End date filter:', endDate);
      }
    }

    const validSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';
    
    const allowedSortFields = [
      'id', 
      'isActive', 
      'version', 
      'tierOfPlan', 
      'startDate', 
      'endDate', 
      'companyId'
    ];
    
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'id';

    const [data, total] = await Promise.all([
      prisma.planHistory.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: {
          [sortField]: validSortOrder
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
    console.log('Error in listPlanHistoryService:', error);
    throw catchAsyncPrismaError(error);
  }
};

module.exports = {
  getPlanHistoryService,
  getPlanHistoryByIdService,
  listPlanHistoryService
};
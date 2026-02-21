const prisma = require("../../prisma");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

/**
 * CREATE
 */
const createNotesService = async (payload, user) => {
  try {
    return await prisma.notes.create({
      data: {
        title: payload.title,
        content: payload.content,
        startDate: new Date(payload.startDate),
        companyId: user.companyId,
      },
      omit: {
        companyId: true
      }

    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * UPDATE
 */
const updateNotesService = async (payload, user) => {
  try {
    const { id } = payload;

    const existing = await prisma.notes.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!existing) {
      throw new AppError("Record not found", 404);
    }

    return await prisma.notes.update({
      where: { id: Number(id) },
      data: {
        title: payload.title,
        content: payload.content,
      },
      omit: {
        companyId: true
      }

    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * DELETE
 */
const deleteNotesService = async (id, user) => {
  try {
    const existing = await prisma.notes.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!existing) {
      throw new AppError("Record not found", 404);
    }

    return await prisma.notes.delete({
      where: { id: Number(id) },
      omit: {
        companyId: true
      }
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * GET BY ID
 */
const getNotesService = async (id, user) => {
  try {
    const data = await prisma.notes.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
      omit: {
        companyId: true
      }

    });

    if (!data) {
      throw new AppError("Record not found", 404);
    }

    return data;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * LIST
 */
const listNotesService = async (query, user) => {
  try {
    const {
      search,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where = {
      companyId: user.companyId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(startDate && endDate && {
        startDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.notes.findMany({
        where,
        orderBy: { startDate: "desc" },
        skip: Number(skip),
        take: Number(limit),
        omit:{
          companyId:true
        }
      }),
      prisma.notes.count({ where }),
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
  createNotesService,
  updateNotesService,
  deleteNotesService,
  getNotesService,
  listNotesService,
};
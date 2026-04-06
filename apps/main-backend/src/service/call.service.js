const prisma = require("@umitrix/database");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");
const { Prisma } = require("@prisma/client");
const crypto = require("crypto");

const createCallService = async (payload, user) => {
  try {
    const companyId = user?.companyId || payload.companyId;

    if (!companyId) {
      throw new AppError("Company ID is required", 400);
    }

    const roomId = crypto.randomBytes(8).toString("hex");

    const call = await prisma.callHistory.create({
      data: {
        ...payload,
        companyId: parseInt(companyId),
        callStatus: payload.callStatus || "PENDING",
        roomId,
      },
    });
    return call;
  } catch (error) {
    console.log(error,'erro')
    throw catchAsyncPrismaError(error);
  }
};

const updateCallStatusService = async (callId, payload, user) => {
  try {
    const { companyId } = user;

    const call = await prisma.callHistory.findUnique({
      where: { id: parseInt(callId) },
    });

    if (!call || call.companyId !== companyId) {
      throw new AppError("Call not found", 404);
    }

    const updateData = {
      callStatus: payload.callStatus,
    };

    if (payload.callStatus === "COMPLETED" && call.callConnectedAt) {
      // Calculate duration in seconds
      const now = new Date();
      const connectedAt = new Date(call.callConnectedAt);
      updateData.callDuration = (now.getTime() - connectedAt.getTime()) / 1000;
    }

    const updatedCall = await prisma.callHistory.update({
      where: { id: parseInt(callId) },
      data: updateData,
    });

    return updatedCall;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

const updateConnectTimeService = async (callId, payload, user) => {
  try {
    const { companyId } = user;
    const { callConnectedAt } = payload;

    const call = await prisma.callHistory.findUnique({
      where: { id: parseInt(callId) },
    });

    if (!call || call.companyId !== companyId) {
      throw new AppError("Call not found", 404);
    }

    // Calculate waiting duration
    const createdAt = new Date(call.createdAt);
    const connectedAt = new Date(callConnectedAt);
    const waitingDuration = (connectedAt.getTime() - createdAt.getTime()) / 1000;

    const updatedCall = await prisma.callHistory.update({
      where: { id: parseInt(callId) },
      data: {
        callConnectedAt: connectedAt,
        waitingDuration,
        callStatus: "ONGOING",
      },
    });

    return updatedCall;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

const listLobbyService = async (payload, user) => {
  try {
    const { companyId } = user;
    const { page = 0, size = 20 } = payload;
    const skip = page * size;

    const [calls, totalCount] = await Promise.all([
      prisma.callHistory.findMany({
        where: {
          companyId,
          callStatus: "PENDING",
        },
        include: {
          customer: true,
          caller: { select: { id: true, name: true, empCode: true } },
        },
        orderBy: { createdAt: "asc" },
        skip,
        take: size,
      }),
      prisma.callHistory.count({
        where: {
          companyId,
          callStatus: "PENDING",
        },
      }),
    ]);

    return { data: calls, page, size, totalCount };
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

const listCompletedCallsService = async (payload, user) => {
  try {
    const { companyId } = user;
    const { page = 0, size = 20, search = "" } = payload;
    const skip = page * size;

    const where = {
      companyId,
      callStatus: "COMPLETED",
    };

    if (search) {
      where.OR = [
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { caller: { name: { contains: search, mode: 'insensitive' } } },
        { receiver: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [calls, totalCount] = await Promise.all([
      prisma.callHistory.findMany({
        where,
        include: {
          customer: true,
          caller: { select: { id: true, name: true, empCode: true } },
          receiver: { select: { id: true, name: true, empCode: true } },
          review: true,
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: size,
      }),
      prisma.callHistory.count({ where }),
    ]);

    return { data: calls, page, size, totalCount };
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

const addReviewService = async (payload, user) => {
  try {
    const companyId = user.companyId || payload.companyId;

    if (!companyId) {
      throw new AppError("Company ID is required", 400);
    }

    const { callId, rating, comment, customerId, userId } = payload;

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        companyId: parseInt(companyId),
        callId,
        customerId,
        userId: userId || user.id || null,
      },
    });

    return review;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

module.exports = {
  createCallService,
  updateCallStatusService,
  updateConnectTimeService,
  listLobbyService,
  listCompletedCallsService,
  addReviewService,
};

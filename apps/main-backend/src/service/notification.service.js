const prisma = require("@umitrix/database");

const getNotificationListService = async (query, user) => {
  const { page = 1, limit = 10, search, type } = query;
  
  const skip = (page - 1) * limit;
  const take = parseInt(limit, 10);

  const whereCondition = {
    userId: user.id,
    companyId: user.companyId,
  };

  if (search) {
    whereCondition.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { message: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (type) {
    if (Array.isArray(type)) {
      whereCondition.type = { in: type };
    } else {
      whereCondition.type = type;
    }
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.notification.count({ where: whereCondition }),
  ]);

  // Aggregate available types for this user/company to return in the response
  // Or we can just return the distinct types they actually have.
  // Alternatively, return a static list of all possible types.
  const distinctTypes = await prisma.notification.findMany({
    where: { companyId: user.companyId, userId: user.id },
    select: { type: true },
    distinct: ['type'],
  });
  
  const typesArray = distinctTypes.map(t => t.type);

  return {
    data: notifications,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
    type: typesArray, // As requested
  };
};

const markNotificationAsReadService = async (id, user) => {
  const notification = await prisma.notification.findFirst({
    where: { id: parseInt(id, 10), userId: user.id }
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  return await prisma.notification.update({
    where: { id: parseInt(id, 10) },
    data: { isRead: true }
  });
};

const createNotificationService = async (data) => {
  return await prisma.notification.create({
    data: {
      userId: data.userId,
      companyId: data.companyId,
      title: data.title,
      message: data.message,
      type: data.type,
      referenceId: data.referenceId,
    }
  });
};

module.exports = {
  getNotificationListService,
  markNotificationAsReadService,
  createNotificationService
};

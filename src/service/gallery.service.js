const prisma = require("../../prisma");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

/**
 * CREATE
 */
const createGalleryService = async (payload, user) => {
  try {
    // Check if tag already exists for this company
    const existing = await prisma.gallery.findFirst({
      where: {
        tag: payload.tag,
        companyId: user.companyId,
      },
    });

    if (existing) {
      throw new AppError("Tag already exists", 400);
    }

    // Verify media exists
    const media = await prisma.media.findFirst({
      where: {
        id: Number(payload.mediaId),
        companyId: user.companyId,
      },
    });

    if (!media) {
      throw new AppError("Media not found", 404);
    }

    return await prisma.gallery.create({
      data: {
        tag: payload.tag,
        mediaId: Number(payload.mediaId),
        companyId: user.companyId,
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * UPDATE
 */
const updateGalleryService = async (payload, user) => {
  try {
    const { id } = payload;

    const existing = await prisma.gallery.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!existing) {
      throw new AppError("Record not found", 404);
    }

    // Check tag uniqueness if updating tag
    if (payload.tag && payload.tag !== existing.tag) {
      const tagExists = await prisma.gallery.findFirst({
        where: {
          tag: payload.tag,
          companyId: user.companyId,
          NOT: { id: Number(id) },
        },
      });

      if (tagExists) {
        throw new AppError("Tag already exists", 400);
      }
    }

    // Verify media if updating mediaId
    if (payload.mediaId) {
      const media = await prisma.media.findFirst({
        where: {
          id: Number(payload.mediaId),
          companyId: user.companyId,
        },
      });

      if (!media) {
        throw new AppError("Media not found", 404);
      }
    }

    return await prisma.gallery.update({
      where: { id: Number(id) },
      data: {
        tag: payload.tag,
        mediaId: payload.mediaId ? Number(payload.mediaId) : undefined,
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * DELETE
 */
const deleteGalleryService = async (id, user) => {
  try {
    const existing = await prisma.gallery.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
    });

    if (!existing) {
      throw new AppError("Record not found", 404);
    }

    return await prisma.gallery.delete({
      where: { id: Number(id) },
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * GET BY ID
 */
const getGalleryService = async (id, user) => {
  try {
    const data = await prisma.gallery.findFirst({
      where: {
        id: Number(id),
        companyId: user.companyId,
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!data) {
      throw new AppError("Record not found", 404);
    }

    // Fetch media details
    const media = await prisma.media.findFirst({
      where: {
        id: data.mediaId,
        companyId: user.companyId,
      },
    });

    return {
      ...data,
      mediaDetails: media,
    };
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * LIST
 */
const listGalleryService = async (query, user) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where = {
      companyId: user.companyId,
      ...(search && {
        tag: { contains: search, mode: "insensitive" },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: Number(skip),
        take: Number(limit),
      }),
      prisma.gallery.count({ where }),
    ]);

    // Fetch media details for each gallery item
    const mediaIds = data.map(item => item.mediaId);
    const mediaMap = {};
    
    if (mediaIds.length > 0) {
      const mediaItems = await prisma.media.findMany({
        where: {
          id: { in: mediaIds },
          companyId: user.companyId,
        },
      });
      
      mediaItems.forEach(media => {
        mediaMap[media.id] = media;
      });
    }

    const dataWithMedia = data.map(item => ({
      ...item,
      mediaDetails: mediaMap[item.mediaId] || null,
    }));

    return {
      data: dataWithMedia,
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
  createGalleryService,
  updateGalleryService,
  deleteGalleryService,
  getGalleryService,
  listGalleryService,
};
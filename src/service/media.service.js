const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("../utils/S3Client");
const prisma = require("../../prisma");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

const BUCKET = process.env.R2_BUCKET;

const getMediaTypeFromMime = (mime) => {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime.startsWith("audio/")) return "AUDIO";
  return "DOCUMENT";
};

/**
 * UPLOAD MEDIA
 */
const uploadMediaService = async (file, body, payload) => {


  if (!file) {
    throw new AppError("No file uploaded", 400);
  }

  const key = `media/${Date.now()}-${file.originalname}`;


  try {
    let s = await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );
  } catch (err) {
    console.error("Cloudflare R2 upload failed:", err);
    throw new AppError("Cloudflare R2 upload failed", 500);
  }

  const publicBase = process.env.R2_BASE_DEV || "";

  return await prisma.media.create({
    data: {
      companyId: body.companyId,
      fileName: payload?.title || file.originalname,
      mimeType: file.mimetype,
      title: body.title,
      size: file.size,
      r2Key: key,
      url: publicBase + key,
      type: getMediaTypeFromMime(file.mimetype),
    },
  });
};


const uploadMultiMediaService = async (files, user, payload) => {

  try {
    if (!files || files.length === 0) {
      throw new AppError("No files uploaded", 400);
    }

    if (payload?.title && payload.title.length !== files.length) {
      throw new AppError("Title doesn't match file count", 400);
    }


    const publicBase = process.env.R2_BASE_DEV || "";
    const mediaData = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const key = `media/${Date.now()}-${i}-${file.originalname}`;

      // 1️⃣ Upload to R2
      try {
        await r2.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
        );
      } catch (err) {
        throw new AppError("Cloudflare R2 upload failed", 500);
      }

      // 2️⃣ Prepare DB record
      mediaData.push({
        companyId: user.companyId,
        fileName: payload?.title?.[i] || file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        r2Key: key,
        url: publicBase + key,
        type: getMediaTypeFromMime(file.mimetype),
      });
    }

    // 3️⃣ Single DB hit ✅
    await prisma.media.createMany({
      data: mediaData,
    });


    return await prisma.media.findMany({
      where: {
        r2Key: { in: mediaData.map((media) => media.r2Key) }
      }
    }); // or fetc
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }

};



/**
 * GET MEDIA BY ID
 */
const getMediaService = async (id) => {
  try {
    const media = await prisma.media.findUnique({
      where: { id: Number(id) },
    });

    if (!media) {
      throw new AppError("Media not found", 404);
    }

    return media;
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};

/**
 * LIST MEDIA
 */
const getMediaListService = async (query) => {
  const { page = 1, limit = 10, type } = query;
  const skip = (page - 1) * limit;

  const where = {
    ...(type && { type }),
  };

  const [data, total] = await Promise.all([
    prisma.media.findMany({
      where,
      skip: Number(skip),
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.media.count({ where }),
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
};

/**
 * DELETE MEDIA
 */
const deleteMediaService = async (id) => {
  const media = await prisma.media.findUnique({
    where: { id: Number(id) },
  });

  if (!media) {
    throw new AppError("Media not found", 404);
  }

  try {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: media.r2Key,
      })
    );
  } catch (err) {
    console.error("Cloudflare R2 delete failed:", err);
    throw new AppError("Failed to delete file from storage", 500);
  }

  await prisma.media.delete({
    where: { id: Number(id) },
  });

  return true;
};


module.exports = {
  uploadMediaService,
  getMediaService,
  deleteMediaService,
  getMediaListService,
  uploadMultiMediaService
}
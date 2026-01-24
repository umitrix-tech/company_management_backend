const { workHoursModal } = require("@prisma/client");
const prisma = require("../../prisma");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};


const alreadyExistsWorkModal = async (data, user) => {
  try {
    let responce = await prisma.workHoursConfiguration.findFirst({
      where: {
        workHoursModal: data.workHoursModal,
        companyId: data.companyId,
      }
    })

    console.log(responce, 'da');

    return responce
  } catch (error) {
    throw catchAsyncPrismaError(error)
  }
}

const createWorkHoursConfigService = async (data, user) => {
  try {

    if (!workHoursModal[data.workHoursModal]) {
      throw new AppError("Invalid work hours modal", 400);
    }
    if (data.startTime > data.endTime) {
      throw new AppError("Start time cannot be greater than end time", 400);
    }

    if (data.workHoursModal == workHoursModal.GENERAL_TIME_COVER && data.shiftTimes) {
      throw new AppError("Shift times cannot be provided for general time cover", 400);
    }

    if (data.workHoursModal == workHoursModal.SHIFT_TIME_COVER && (!data.shiftTimes || data.shiftTimes.length == 0)) {
      throw new AppError("Shift times are required for shift time cover", 400);
    }

    const { companyId } = user;

    let checkExist = await alreadyExistsWorkModal({ companyId, workHoursModal: data.workHoursModal })
    if (checkExist) {
      throw new AppError("Work hours configuration already exists", 400);
    };

    return prisma.workHoursConfiguration.create({
      data: {
        workHoursModal: data.workHoursModal,
        startTime: data.startTime,
        endTime: data.endTime,
        workingDurationMinutesMin: data.workingDurationMinutesMin,
        workingDurationMintesMax: data.workingDurationMintesMax,
        shiftTimes: data.shiftTimes || [],
        weeklyOffDays: data.weeklyOffDays || [],
        companyId: user.companyId
      }
    });
  } catch (error) {
    throw catchAsyncPrismaError(error)
  }

};

const getWorkHoursConfigService = async (user) => {
  return prisma.workHoursConfiguration.findMany({
    where: {
      companyId: user.companyId
    },
    orderBy: {
      id: "desc"
    }
  });
};

const getWorkHoursConfigByIdService = async (id, user) => {
  const config = await prisma.workHoursConfiguration.findFirst({
    where: {
      id: Number(id),
      companyId: user.companyId
    }
  });

  if (!config) {
    throw new AppError("Work hours configuration not found", 404);
  }

  return config;
};

const updateWorkHoursConfigService = async (data, user) => {

  try {

    const exists = await prisma.workHoursConfiguration.findFirst({
      where: {
        id: parseInt(data.id),
        companyId: user.companyId
      }
    });

    if (!exists) {
      throw new AppError("Work hours configuration not found", 404);
    }

    if (data.workHoursModal && !workHoursModal[data.workHoursModal]) {
      throw new AppError("Invalid work hours modal", 400);
    }

    if (
      data.startTime &&
      data.endTime &&
      timeToMinutes(data.startTime) >= timeToMinutes(data.endTime)
    ) {
      throw new AppError("Start time must be less than end time", 400);
    }

    if (
      data.workHoursModal === workHoursModal.GENERAL_TIME_COVER &&
      data.shiftTimes?.length > 0
    ) {
      throw new AppError(
        "Shift times cannot be provided for general time cover",
        400
      );
    }

    if (
      data.workHoursModal === workHoursModal.SHIFT_TIME_COVER &&
      (!data.shiftTimes || data.shiftTimes.length === 0)
    ) {
      throw new AppError(
        "Shift times are required for shift time cover",
        400
      );
    }

    // prevent duplicate modal for same company (exclude self)
    if (data.workHoursModal) {
      const duplicate = await prisma.workHoursConfiguration.findFirst({
        where: {
          companyId: user.companyId,
          workHoursModal: data.workHoursModal,
          NOT: { id: Number(data.id) }
        }
      });

      if (duplicate) {
        throw new AppError(
          "Work hours configuration already exists",
          400
        );
      }
    }

    return await prisma.workHoursConfiguration.update({
      where: { id: Number(data.id) },
      data: {
        workHoursModal: data.workHoursModal,
        startTime: data.startTime,
        endTime: data.endTime,
        workingDurationMinutesMin: data.workingDurationMinutesMin,
        workingDurationMintesMax: data.workingDurationMintesMax,
        shiftTimes: data.shiftTimes,
        weeklyOffDays: data.weeklyOffDays
      }
    });
  } catch (error) {
    throw catchAsyncPrismaError(error);
  }
};


const deleteWorkHoursConfigService = async (id, user) => {
  const exists = await prisma.workHoursConfiguration.findFirst({
    where: {
      id: Number(id),
      companyId: user.companyId
    }
  });

  if (!exists) {
    throw new AppError("Work hours configuration not found", 404);
  }

  await prisma.workHoursConfiguration.delete({
    where: { id: Number(id) }
  });
};

const getOwnWorkingHoursConfigService = async (user) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      id: user.id,
      companyId:user.companyId
    }
  })

  if (!userInfo) {
    throw new AppError("User not found", 404);
  }

  if (!userInfo.WorkHoursConfigurationId) {
    throw new AppError("Work hours configuration not found", 404);
  }


  const Config = await prisma.workHoursConfiguration.findFirst({
    where: {
      companyId: user.companyId,
      id:parseInt(userInfo.WorkHoursConfigurationId)
    }
  });

  return Config;
}

module.exports = {
  createWorkHoursConfigService,
  updateWorkHoursConfigService,
  deleteWorkHoursConfigService,
  getWorkHoursConfigService,
  getWorkHoursConfigByIdService,
  getOwnWorkingHoursConfigService
};

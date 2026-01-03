

const { userProfilesGetService, userProfileListGetService } = require("../service/user.service");
const catchAsync = require("../utils/catchAsync");

const userProfileGetController = catchAsync(async (req, res) => {
    const responce = await userProfilesGetService(req.query);
    res.status(200).json({ message: "userProfile Data successfully", data: responce });
});

const userProfileListGetController = catchAsync(async (req, res) => {
    const responce = await userProfileListGetService(req.query, req.user);
    res.status(200).json({ message: "userProfiles List successfully", data: responce });
});


const userProfileUpdateController = catchAsync(async (req, res) => {
    const responce = await userProfileUpdateService(req.body, req.user);
    res.status(200).json({ message: "userProfile updated successfully", data: responce });
});

const createUserController = catchAsync(async (req, res) => {
    const responce = await createUserService(req.body, req.user);
    res.status(200).json({ message: "user created successfully", data: responce });
})


module.exports = {
    userProfileGetController,
    userProfileUpdateController,
    userProfileListGetController,
    createUserController
};



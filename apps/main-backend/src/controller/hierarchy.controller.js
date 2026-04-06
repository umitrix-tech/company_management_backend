const { getHierarchyTreeService, assignManagerService, removeManagerService } = require("../service/hierarchy.service");
const catchAsync = require("../utils/catchAsync");

const getHierarchyController = catchAsync(async (req, res) => {
    const responce = await getHierarchyTreeService(req.query, req.user);
    res.status(200).json({ message: "Hierarchy data fetched successfully", data: responce });
});

const assignManagerController = catchAsync(async (req, res) => {
    const responce = await assignManagerService(req.body, req.user);
    res.status(200).json({ message: "Manager assigned successfully", data: responce });
});

const removeManagerController = catchAsync(async (req, res) => {
    const responce = await removeManagerService(req.body, req.user);
    res.status(200).json({ message: "Manager removed successfully", data: responce });
});


module.exports = {
    getHierarchyController,
    assignManagerController,
    removeManagerController
};

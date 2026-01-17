const catchAsync = require("../utils/catchAsync");
const {
    createParticularDateService,
    updateParticularDateService,
    deleteParticularDateService,
    getParticularDateService,
    listParticularDateService,
} = require("../service/particularDateConfig.service");

const createParticularDateController = catchAsync(async (req, res) => {
    const data = await createParticularDateService(req.body, req.user);
    res.status(201).json({ message: "Created successfully", data });
});

const updateParticularDateController = catchAsync(async (req, res) => {
    const data = await updateParticularDateService(req.body, req.user);
    res.status(200).json({ message: "Updated successfully", data });
});

const deleteParticularDateController = catchAsync(async (req, res) => {
    await deleteParticularDateService(req.query.id, req.user);
    res.status(200).json({ message: "Deleted successfully" });
});

const getParticularDateController = catchAsync(async (req, res) => {
    const data = await getParticularDateService(req.params.id, req.user);
    res.status(200).json({ data });
});

const listParticularDateController = catchAsync(async (req, res) => {
    const data = await listParticularDateService(req.query, req.user);
    res.status(200).json(data);
});


module.exports = {
    createParticularDateController,
    updateParticularDateController,
    deleteParticularDateController,
    getParticularDateController,
    listParticularDateController


}
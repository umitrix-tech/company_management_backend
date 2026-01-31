const catchAsync = require("../utils/catchAsync");
const {
    createTimeLineService,
    updateTimeLineService,
    deleteTimeLineService,
    getTimeLineService,
    listTimeLineService,
} = require("../service/timeLineConfig.service");

const createTimeLinController = catchAsync(async (req, res) => {
    const data = await createTimeLineService(req.body, req.user);
    res.status(201).json({ message: "Created successfully", data });
});

const updateTimeLinController = catchAsync(async (req, res) => {
    const data = await updateTimeLineService(req.body, req.user);
    res.status(200).json({ message: "Updated successfully", data });
});

const deleteTimeLinController = catchAsync(async (req, res) => {
   const data = await deleteTimeLineService(req.query.id, req.user);
    res.status(200).json({ message: "Deleted successfully", data });
});

const getTimeLinController = catchAsync(async (req, res) => {
    const data = await getTimeLineService(req.params.id, req.user);
    res.status(200).json({ data });
});

const listTimeLinController = catchAsync(async (req, res) => {
    const data = await listTimeLineService(req.query, req.user);
    res.status(200).json(data);
});


module.exports = {
    createTimeLinController,
    deleteTimeLinController,
    getTimeLinController,
    listTimeLinController,
    updateTimeLinController,
}
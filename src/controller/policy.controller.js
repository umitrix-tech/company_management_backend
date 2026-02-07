const catchAsync = require("../utils/catchAsync");
const {
    createPolicyService,
    updatePolicyService,
    deletePolicyService,
    getPolicyService,
    listPolicyService,
} = require("../service/policy.service");

const createPolicyController = catchAsync(async (req, res) => {
    const data = await createPolicyService(req.body, req.user);
    res.status(201).json({ message: "Created successfully", data });
});

const updatePolicyController = catchAsync(async (req, res) => {
    const data = await updatePolicyService(req.body, req.user);
    res.status(200).json({ message: "Updated successfully", data });
});

const deletePolicyController = catchAsync(async (req, res) => {
    const data = await deletePolicyService(req.query.id, req.user);
    res.status(200).json({ message: "Deleted successfully", data });
});

const getPolicyController = catchAsync(async (req, res) => {
    const data = await getPolicyService(req.params.id, req.user);
    res.status(200).json({ data });
});

const listPolicyController = catchAsync(async (req, res) => {
    const data = await listPolicyService(req.query, req.user);
    res.status(200).json(data);
});

module.exports = {
    createPolicyController,
    deletePolicyController,
    getPolicyController,
    listPolicyController,
    updatePolicyController,
};

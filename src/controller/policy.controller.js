// controllers/policy.controller.js
const policyService = require("../service/policy.service");

const createPolicy = async (req, res) => {
  try {
    const data = await policyService.createPolicy(req.body);
    return res.status(201).json({ message: "Policy created", data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllPolicies = async (req, res) => {
  try {
    const data = await policyService.getAllPolicies();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPolicyById = async (req, res) => {
  try {
    const data = await policyService.getPolicyById(Number(req.params.id));
    return res.json(data);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const updatePolicyById = async (req, res) => {
  try {
    const data = await policyService.updatePolicyById(
      Number(req.params.id),
      req.body
    );
    return res.json({ message: "Policy updated", data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePolicyById = async (req, res) => {
  try {
    await policyService.deletePolicyById(Number(req.params.id));
    return res.json({ message: "Policy deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPolicy,
  getAllPolicies,
  getPolicyById,
  updatePolicyById,
  deletePolicyById
};

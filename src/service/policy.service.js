// services/policy.service.js
const prisma = require("../prisma/client");

const createPolicy = async (payload) => {
  const { name, description, roleAccess, mediaUrls } = payload;

  return prisma.policy.create({
    data: {
      name,
      description,
      roleAccess,
      media: mediaUrls
        ? {
            create: mediaUrls.map(url => ({ mediaUrl: url }))
          }
        : undefined
    },
    include: { media: true }
  });
};

const getAllPolicies = async () => {
  return prisma.policy.findMany({
    include: { media: true }
  });
};

const getPolicyById = async (id) => {
  const policy = await prisma.policy.findUnique({
    where: { id },
    include: { media: true }
  });

  if (!policy) {
    throw new Error("Policy not found");
  }

  return policy;
};

const updatePolicyById = async (id, data) => {
  return prisma.policy.update({
    where: { id },
    data
  });
};

const deletePolicyById = async (id) => {
  return prisma.policy.delete({
    where: { id }
  });
};

module.exports = {
  createPolicy,
  getAllPolicies,
  getPolicyById,
  updatePolicyById,
  deletePolicyById
};

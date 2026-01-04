const prisma = require("../../prisma");
const AppError = require("../utils/AppError");
const { ROLE_OWNER } = require("../utils/constData");

/**
 * CREATE ROLE
 */
const createRoleService = async (data, user) => {
    return prisma.role.create({
        data: {
            name: data.name,
            privileges: data.privileges || {},
            companyId: user.companyId
        }
    });
};

/**
 * GET ALL ROLES (company scoped)
 */
const getRolesService = async (payload, user) => {
    const { search = "" } = payload;
    return prisma.role.findMany({
        where: {
            companyId: user.companyId,
            name: {
                ...(search && { contains: search, mode: "insensitive" }),
                not: ROLE_OWNER
            }
        },
        orderBy: {
            id: "asc"
        }
    });
};

/**
 * GET ROLE BY ID
 */
const getRoleByIdService = async (id, user) => {
    const role = await prisma.role.findUnique({
        where: {
            id: parseInt(id),
            companyId: parseInt(user.companyId)
        }
    });

    if (!role) {
        throw new AppError("Role not found", 404);
    }

    return role;
};

/**
 * UPDATE ROLE
 */
const updateRoleService = async (data, user) => {

    if (!data.id) {
        throw new AppError("Role id is required", 400);
    }

    await getRoleByIdService(data.id, user);

    return prisma.role.update({
        where: { id: data.id },
        data: {
            name: data.name,
            privileges: data.privileges
        }
    });
};

/**
 * DELETE ROLE
 */
const deleteRoleService = async (id, user) => {
    await getRoleByIdService(id, user);

    return prisma.role.delete({
        where: { id }
    });
};


module.exports = {
    createRoleService,
    getRolesService,
    getRoleByIdService,
    updateRoleService,
    deleteRoleService
}
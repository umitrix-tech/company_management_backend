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
const getRolesService = async (user) => {
    return prisma.role.findMany({
        where: {
            companyId: user.companyId,
            AND: {
                name: {
                    not: ROLE_OWNER
                }
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
    console.log({
        id,
        user,
    });
    
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
const updateRoleService = async (id, data, user) => {
    await getRoleByIdService(id, user);

    return prisma.role.update({
        where: { id },
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
const prisma = require("../../prisma");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");
const { ROLE_OWNER } = require("../utils/constData");

/**
 * CREATE ROLE
 */
const createRoleService = async (data, user) => {

    try {

        if (data.name == ROLE_OWNER) {
            throw new AppError("Restricted Role Name", 400);
        };

        const role = await prisma.role.create({
            data: {
                name: data.name,
                privileges: data.privileges || {},
                companyId: user.companyId,
                RolePermission: {
                    create: data.rolePermission.map(parent => ({
                        companyId: user.companyId,
                        key: parent.key,
                        label: parent.label,
                        access: parent.access || false
                    }))
                }
            },
            include: { RolePermission: true }
        });

        for (const parent of role.RolePermission) {
            const originalParent = data.rolePermission.find(p => p.key === parent.key);
            if (originalParent?.children?.length) {
                await prisma.rolePermission.createMany({
                    data: originalParent.children.map(child => ({
                        key: child.key,
                        label: child.label,
                        parentId: parent.id,
                        companyId: user.companyId,
                        roleId: role.id,
                        access: child.access || false,
                    }))
                });
            }
        }

        return prisma.role.findUnique({
            where: { id: role.id },
            include: {
                RolePermission: {
                    where: { parentId: null },
                    include: { children: true }
                }
            }
        });

    } catch (error) {
        console.log(error, 'erp');

        throw catchAsyncPrismaError(error);
    }

};



/**
 * GET ALL ROLES (company scoped)
 */
const getRolesService = async (payload, user) => {
    try {
        const { search = "" } = payload;
        return await prisma.role.findMany({
            where: {
                name: {
                    contains: search, mode: "insensitive",
                    not: ROLE_OWNER
                }
            },
            include: {
                RolePermission: {
                    where: { parentId: null },
                    include: { children: true }
                }
            }
        });

    } catch (error) {
        throw catchAsyncPrismaError(error);
    }
};

/**
 * GET ROLE BY ID
 */
const getRoleByIdService = async (id, user) => {
    const role = await prisma.role.findUnique({
        where: {
            id: parseInt(id),
            companyId: parseInt(user.companyId),
        },
        include: {
            RolePermission: true
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

    return prisma.$transaction(async (tx) => {

        // 1️⃣ Update role
        await tx.role.update({
            where: { id: data.id },
            data: {
                name: data.name,
                privileges: data.privileges || {}
            }
        });

        // 2️⃣ Delete old permissions
        await tx.rolePermission.deleteMany({
            where: { roleId: data.id }
        });

        // 3️⃣ Create parent permissions
        await tx.rolePermission.createMany({
            data: data.rolePermission.map(parent => ({
                roleId: data.id,
                key: parent.key,
                companyId: user.companyId,
                label: parent.label,
                parentId: null,
                access: parent.access || false,

            }))
        });

        // 4️⃣ Fetch parents
        const parents = await tx.rolePermission.findMany({
            where: {
                roleId: data.id,
                parentId: null
            }
        });

        // 5️⃣ Create children
        for (const parent of parents) {
            const inputParent = data.rolePermission.find(p => p.key === parent.key);

            if (inputParent?.children?.length) {
                await tx.rolePermission.createMany({
                    data: inputParent.children.map(child => ({
                        roleId: data.id,
                        key: child.key,
                        label: child.label,
                        companyId: user.companyId,
                        parentId: parent.id,
                        access: child.access || false,
                    }))
                });
            }
        }

        // 6️⃣ Return updated role
        return tx.role.findUnique({
            where: { id: data.id },
            include: {
                RolePermission: {
                    where: { parentId: null },
                    include: { children: true }
                }
            }
        });
    });
};

/**
 * DELETE ROLE
 */
const deleteRoleService = async (roleId, user) => {
    if (!roleId) {
        throw new AppError("Role id is required", 400);
    }

    // 1️⃣ Validate role belongs to company
    const role = await prisma.role.findFirst({
        where: {
            id: roleId,
            companyId: user.companyId
        }
    });

    if (!role) {
        throw new AppError("Role not found", 404);
    }

    const isAssignToAnyOne = await prisma.user.findFirst({
        where: {
            roleId: parseInt(roleId)
        }
    })

    if (isAssignToAnyOne) {
        throw new AppError("Role is assigned to some user", 400);
    }

    return prisma.$transaction(async (tx) => {

        await tx.rolePermission.deleteMany({
            where: {
                roleId,
                parentId: { not: null }
            }
        });

        await tx.rolePermission.deleteMany({
            where: {
                roleId,
                parentId: null
            }
        });

        return tx.role.delete({
            where: { id: roleId, }, include: { RolePermission: true }
        });
    });
};


module.exports = {
    createRoleService,
    getRolesService,
    getRoleByIdService,
    updateRoleService,
    deleteRoleService
}
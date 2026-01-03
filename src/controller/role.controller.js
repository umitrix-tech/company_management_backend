const { createRoleService,
    deleteRoleService,
    getRoleByIdService,
    getRolesService,
    updateRoleService
} = require("../service/role.service.js");
const catchAsync = require("../utils/catchAsync.js");

/**
 * CREATE ROLE
 */
const createRoleController = catchAsync(async (req, res) => {
    const role = await createRoleService(req.body, req.user);
    res.status(201).json({
        message: "role created successfully",
        data: role
    });
});

/**
 * GET ALL ROLES
 */
const getRolesController = catchAsync(async (req, res) => {
    const roles = await getRolesService(req.user);
    res.status(200).json({
        message: "role retrived successfully",
        data: roles
    });
});

/**
 * GET ROLE BY ID
 */
const getRoleByIdController = catchAsync(async (req, res) => {
    const role = await getRoleByIdService(
        parseInt(req.query.id),
        req.user
    );


    res.status(200).json({
        message: "role retrived successfully",
        data: role
    });
});

/**
 * UPDATE ROLE
 */
const updateRoleController = catchAsync(async (req, res) => {
    const role = await updateRoleService(
        parseInt(req.query.id),
        req.body,
        req.user
    );

    res.status(200).json({
        data: role,
        message: "role updated successfully",
    });
});

/**
 * DELETE ROLE
 */
const deleteRoleController = catchAsync(async (req, res) => {
    const responce = await deleteRoleService(
        parseInt(req.query.id),
        req.user
    );
    res.status(200).json({
        data: responce,
        message: "role deleted successfully"
    });
});



module.exports = {
    createRoleController,
    getRolesController,
    getRoleByIdController,
    updateRoleController,
    deleteRoleController
}
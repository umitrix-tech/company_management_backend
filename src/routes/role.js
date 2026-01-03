const express = require("express");
const router = express.Router();
const {
    createRoleController,
    updateRoleController,
    deleteRoleController,
    getRolesController,
    getRoleByIdController
} = require("../controller/role.controller");

const validate = require("../validation");

const {
    createRoleSchema,
    roleIdParamSchema,
    listRoleSchema,
    updateRoleSchema
} = require("../validation/role.validation");

const auth = require('../middleware/auth.middleware');

router.post("/create", auth, validate(createRoleSchema), createRoleController);
router.get("/list", auth, validate(listRoleSchema), getRolesController);
router.get("/", auth, validate(roleIdParamSchema), getRoleByIdController);
router.put("/:id", auth, validate(updateRoleSchema), updateRoleController);
router.delete("/", auth, validate(roleIdParamSchema), deleteRoleController);

module.exports = router;

const express = require("express");
const router = express.Router();
const validate = require("../validation");
const auth = require("../middleware/auth.middleware");
const { userProfileGetController, userProfileUpdateController, userProfileListGetController, createUserController } = require("../controller/user.controller");
const { updateUserSchemaValidation, userProfileListValidation, createUserSchemaValidation } = require("../validation/user.validation");


router.get(
    '/list',
    auth,
    validate(userProfileListValidation),
    userProfileListGetController
);

router.get(
    '/:id',
    auth,
    validate(updateUserSchemaValidation),
    userProfileGetController
);

router.put(
    '/',
    auth,
    validate(updateUserSchemaValidation),
    userProfileUpdateController
)

router.post("/create", 
    auth,validate(createUserSchemaValidation),
    createUserController
)

module.exports = router;


const express = require("express");
const router = express.Router();
const validate = require("../validation");
const auth = require("../middleware/auth.middleware");
const { userProfileGetController, userProfileUpdateController, userProfileListGetController } = require("../controller/user.controller");
const { updateUserSchemaValidation, userProfileListValidation } = require("../validation/user.validation");


router.get(
    '/',
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
    '/profile',
    auth,
    validate(updateUserSchema),
    userProfileUpdateController
)

module.exports = router;


const express = require("express");
const router = express.Router();
const validate = require("../validation");
const { authValidator } = require("../validation/auth.validation");
const { loginController, registerController } = require("../controller/auth.controller");
const prisma = require("../../prisma");

router.post("/login", validate(authValidator.login), loginController);
router.post("/register", validate(authValidator.register), registerController);
router.get('/get', async (req,res)  => {

    let s = await prisma.user.findMany({});

    return {
        reslt:s,
        messsage:"Sucucse"
    }
    
})

module.exports = router;


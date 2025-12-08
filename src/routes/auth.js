const express = require("express");
const router = express.Router();
const validate = require("../validation");
const { authValidator } = require("../validation/auth.validation");
const { loginController, registerController } = require("../controller/auth.controller");
const prisma = require("../../prisma");

router.post("/login", validate(authValidator.login), loginController);
router.post("/register", validate(authValidator.register), registerController);

router.get('/get', async (req, res) => {
  try {
    const users = await prisma.user.findMany({});
    res.status(200).json({
      result: users,
      message: "Success"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


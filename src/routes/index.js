const express = require("express");
const router = express.Router();

const auth = require("./auth");

router.get("/logCheck", (req, res) => {
    console.log(JSON.stringify(req.query), "Logs test");
    res.send("ok");
});
router.use("/auth", auth);




module.exports = router;

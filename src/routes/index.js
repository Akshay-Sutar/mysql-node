const { Router } = require("express");
const router = Router();

router.get("/", (req, res, next) => res.send("working"));
router.use("/api/employees", require("./employee.route"));

module.exports = router;

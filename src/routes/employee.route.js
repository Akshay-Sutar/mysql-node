const { Router } = require("express");
const validateJSONSchema = require('../validation/validators');
const EmployeeController = require("../controller/employee.controller");

const router = Router();

router.get("/", EmployeeController.list);
router.get("/:id", EmployeeController.get);
router.post("/",validateJSONSchema('employee.create'), EmployeeController.create);
router.put("/:id",validateJSONSchema('employee.update'), EmployeeController.update);
router.delete("/:id", EmployeeController.delete);
router.patch("/:id", EmployeeController.patch);

module.exports = router;

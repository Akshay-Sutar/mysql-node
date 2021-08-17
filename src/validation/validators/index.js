const { StatusCodes } = require("http-status-codes");
const Ajv = require("ajv").default;
const addFormats = require("ajv-formats").default;

const ajv = new Ajv({
  allErrors: true,
});

addFormats(ajv);

const createEmployeeSchema = require("../schema/employee/create.json");
const updateEmployeeSchema = require("../schema/employee/update.json");
ajv.addSchema(createEmployeeSchema,'employee.create');
ajv.addSchema(updateEmployeeSchema,'employee.update');

const validateJSONSchema = (name) => {
  return async (req, res, next) => {
    try {
        const validate = ajv.getSchema(name);
        await validate(req.body);
        next();
    } catch (error) {
      if (error instanceof Ajv.ValidationError) {
        const errors = error.errors.map(
          ({ instancePath, params, message }) => (instancePath, params, message)
        );
        return res.status(StatusCodes.BAD_REQUEST).json(errors);
      }

      return next(error);
    }
  };
};

module.exports = validateJSONSchema;
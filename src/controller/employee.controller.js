const { StatusCodes } = require("http-status-codes");
const employeeService = require("../service/employee.service");
const { JsonPatchError, applyPatch } = require("fast-json-patch");
const moment = require("moment");

const {
  mysql: { errorCodes },
} = require("../config");
const { parse } = require("dotenv");

class EmployeeController {
  constructor() {
    this.list = this.list.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.patch = this.patch.bind(this);
  }

  async list(req, res, next) {
    try {
      let { page, limit } = req.query;
      page = parseInt(page, 10) || 1;
      limit = parseInt(limit, 10) || 10;
      const fullUrl = [
        req.protocol,
        "://",
        req.get("host"),
        req.baseUrl,
        req.path,
      ].join("");
      const pageData = await employeeService.getPage(page, limit, fullUrl);
      res.set({
        "X-Pagination-Per-Page": limit,
        "X-Pagination-Current-Page": page,
        "X-Pagination-Total-Pages": pageData?.pages,
        "X-Pagination-Total-Entries": pageData?.total_count,
      });
      return res.status(StatusCodes.OK).json(pageData);
    } catch (error) {
      return next(error);
    }
  }

  async get(req, res, next) {
    try {
      let { id: employeeId } = req.params;
      employeeId = parseInt(employeeId, 10) || 0;
      const employee = await employeeService.get(employeeId);
      if (employee) {
        return res.status(StatusCodes.OK).json(employee);
      } else {
        return res.status(StatusCodes.NOT_FOUND).end();
      }
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const created = await employeeService.create(req.body);

      // Set location header to newly created resource
      const resourceUrl = [
        req.protocol,
        "://",
        req.get("host"),
        req.baseUrl,
        req.path,
        created.id,
      ].join("");
      res.location(resourceUrl);

      return res.status(StatusCodes.CREATED).json(created);
    } catch (error) {
      if (error.code === errorCodes.uniqueViolation) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Duplicate entity",
        });
      }
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      let { id: employeeId } = req.params;
      employeeId = parseInt(employeeId, 10) || 0;
      const updated = await employeeService.update(employeeId, req.body);
      return res.status(StatusCodes.OK).json(updated);
    } catch (error) {
      return next(error);
    }
  }

  async delete(req, res, next) {
    try {
      let { id: employeeId } = req.params;
      employeeId = parseInt(employeeId, 10);
      await employeeService.delete(employeeId);
      return res.status(StatusCodes.NO_CONTENT).end();
    } catch (error) {
      return next(error);
    }
  }

  async patch(req, res, next) {
    try {
      let { id: employeeId } = req.params;
      employeeId = parseInt(employeeId, 10);
      const employee = await employeeService.get(employeeId);
      if (!employeeId) {
        return res.status(StatusCodes.NOT_FOUND).end();
      }
      const { newDocument } = applyPatch(employee, req.body, true, false);
      newDocument.hired_date = moment(
        newDocument.hired_date,
        "YYYY-MM-DD"
      ).format("YYYY-MM-DD");
      const updated = await employeeService.update(employeeId, newDocument);
      return res.status(StatusCodes.OK).json(updated);
    } catch (err) {
      if (err instanceof JsonPatchError) {
        const errors = {
          message: "Malformed patch",
          detailed: err,
        };
        return res.status(StatusCodes.BAD_REQUEST).json(errors);
      }
      return next(err);
    }
  }
}

module.exports = new EmployeeController();

const { asyncQuery } = require("../db");
const moment = require("moment");

class EmployeeService {
  constructor() {
    this.getPage = this.getPage.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getPage(page, limit, fullUrl) {
    const table = "employee";
    const countQuery = `SELECT table_rows as count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'employees' and table_name = '${table}'`;
    let offset = (page - 1) * limit;
    var rows = await asyncQuery(countQuery);
    let total_count = rows[0]["count"] ?? 0;

    let pagedResponse = {
      pages: 0,
      first_page: "",
      last_page: "",
      prev_page: "",
      next_page: "",
      page_size: limit,
      total_count,
      data: [],
    };

    if (total_count == 0) {
      return pagedResponse;
    }

    const query = ` select * from ${table} LIMIT ${limit} OFFSET ${offset} `;
    var rows = await asyncQuery(query);

    const data = rows;

    let queryParams = new URLSearchParams();
    const firstPageNo = 1;
    queryParams.set("page", firstPageNo);
    queryParams.set("limit", limit);
    const firstPageUrl = [fullUrl, "?", queryParams.toString()].join("");

    const lastPageNo = parseInt(Math.ceil(total_count / limit), 10);
    queryParams.set("page", lastPageNo);
    queryParams.set("limit", limit);
    const lastPageUrl = [fullUrl, "?", queryParams.toString()].join("");

    const prevPageNo = page > firstPageNo ? page - 1 : firstPageNo;
    queryParams.set("page", prevPageNo);
    queryParams.set("limit", limit);
    const prevPageUrl = [fullUrl, "?", queryParams.toString()].join("");

    const nextPageNo = page < lastPageNo ? page + 1 : lastPageNo;
    queryParams.set("page", nextPageNo);
    queryParams.set("limit", limit);
    const nextPageUrl = [fullUrl, "?", queryParams.toString()].join("");

    pagedResponse = {
      pages: lastPageNo,
      first_page: firstPageUrl,
      last_page: lastPageUrl,
      prev_page: prevPageUrl,
      next_page: nextPageUrl,
      page_size: limit,
      total_count,
      data,
    };

    return pagedResponse;
  }

  async get(id) {
    const table = "employee";
    const query = `select * from ${table} where id=?`;
    let ResultSetHeader = await asyncQuery(query, [id]);
    return ResultSetHeader[0];
  }

  async create(req) {
    let { name, code, salary, dept_id, manager_id, hired_date } = req;
    dept_id = parseInt(manager_id, 10);
    manager_id = parseInt(manager_id, 10);
    let currentDate = moment().format("YYYY-MM-DD HH:MM:SS");
    let params = [
      name,
      code,
      salary,
      dept_id,
      manager_id,
      hired_date,
      currentDate,
      currentDate,
    ];

    const table = "employee";
    const query = ` insert into ${table} (name,code,salary,dept_id,manager_id,hired_date,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?) `;
    const ResultSetHeader = await asyncQuery(query, params);
    return ResultSetHeader.insertId;
  }

  async update(id, { name, code, salary, dept_id, manager_id, hired_date }) {
    dept_id = parseInt(manager_id, 10);
    manager_id = parseInt(manager_id, 10);
    let currentDate = moment().utc();
    let params = [name, code, salary, dept_id, manager_id, hired_date, id];
    const table = "employee";
    const query = `update ${table} SET name = ?, code =?, salary =?, dept_id =?, manager_id=?, hired_date=? where id=? `;
    const ResultSetHeader = await asyncQuery(query, params);
    return ResultSetHeader.affectedRows;
  }

  async delete(id) {
    const table = "employee";
    const query = `delete from employee where id= ? `;
    const params = [id];
    const ResultSetHeader = await asyncQuery(query, params);
    return ResultSetHeader.affectedRows;
  }
}

module.exports = new EmployeeService();

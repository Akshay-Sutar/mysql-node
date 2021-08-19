const mysql = require("mysql");
const { errorCodes, ...options } = require("../config").mysql;

const pool = mysql.createPool(options);

const asyncQuery = (query, params=[]) => {
  return new Promise((resolve, reject) => {
    query = mysql.format(query, params);
    return pool.query(query, (error, results, fields) => {
      if (error) {
        return reject(error);
      }

      return resolve(results, params);
    });
  });
};

module.exports = {
  pool,
  asyncQuery
};

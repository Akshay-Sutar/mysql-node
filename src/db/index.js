let mysql = require("mysql");
let config = require("../config");

let pool = mysql.createPool({
  connectionLimit: config.mysql.connectionLimit,
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
});

const asyncQuery = (query, params=[]) => {
  return new Promise((resolve, reject) => {
    query = mysql.format(query, params);
    pool.query(query, (error, results, fields) => {
      if (error) {
        return reject(error);
      }

      return resolve(results, params);
    });
  });
};

module.exports = {
  pool: pool,
  asyncQuery:asyncQuery
};

if (process.env.NODE_ENV === "development") {
  const path = require("path");
  require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });
}

module.exports = {
  PORT: parseInt(process.env.PORT, 10) || 3000,
  mysql: {
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    host: process.env.mysql_host,
    database: process.env.mysql_database,
    connectionLimit: parseInt(process.env.mysql_connection_limit, 10) || 10,
    errorCodes: {
      uniqueViolation: 1062,
    },
  },
};

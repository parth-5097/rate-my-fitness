var mysql = require("mysql");
var pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: "rate_my_fitness",
  multipleStatements: true,
  timezone: "utc",
});
module.exports = pool;

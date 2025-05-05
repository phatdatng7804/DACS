require("dotenv").config();

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Kết nối thất bại:", err.message);
  } else {
    console.log("✅ Đã kết nối thành công tới MySQL!");
    connection.release();
  }
});

module.exports = pool.promise();

const db = require("../Models/Db");

exports.getMenu = async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM menu_items WHERE available = 1"
  );
  res.json(rows);
};

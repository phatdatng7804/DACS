const db = require("../Models/Db");
exports.getMenu = async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM menu_items WHERE available = 1"
  );
  res.json(rows);
};
/*
exports.getMenu = (req, res) => {
  res.json([
    { id: 1, name: "Phở bò", price: 45000 },
    { id: 2, name: "Bún chả", price: 40000 },
  ]);
};*/

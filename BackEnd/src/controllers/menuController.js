const db = require("../Models/Db");

exports.getMenu = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM menu_items WHERE status = 'approved'"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách món ăn" });
  }
};

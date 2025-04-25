const db = require("../Models/Db");

exports.getAllMenu = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT m.*, c.name AS category_name
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      ORDER BY m.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách món ăn", error: err.message });
  }
};

exports.addMenuItem = async (req, res) => {
  const {
    name,
    description,
    price,
    image_url,
    category_id,
    available = true,
  } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO menu_items (name, description, price, image_url, category_id, available) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, price, image_url, category_id, available]
    );
    res.json({ message: "Thêm món ăn thành công", id: result.insertId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Thêm món không thành công", error: err.message });
  }
};

// Sửa món ăn
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    image_url,
    category_id,
    available = true,
  } = req.body;
  try {
    await db.execute(
      "UPDATE menu_items SET name = ?, description = ?, price = ?, image_url = ?, category_id = ?, available = ? WHERE id = ?",
      [name, description, price, image_url, category_id, available, id]
    );
    res.json({ message: "Cập nhật món ăn thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Cập nhật món không thành công", error: err.message });
  }
};

// xóa món ăn
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM menu_items WHERE id = ?", [id]);
    res.json({ message: "Xóa món ăn thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Xóa món không thành công", error: err.message });
  }
};

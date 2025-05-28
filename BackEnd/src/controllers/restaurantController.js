const db = require("../Models/Db");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

exports.getAllMenu = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        m.id, m.name, m.description, m.price, 
        m.image_url AS imageUrl, 
        m.category_id, m.available, m.status, 
        c.name AS category_name
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      ORDER BY m.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách món ăn",
      error: err.message,
    });
  }
};

exports.addMenuItem = [
  verifyToken,
  requireRole(["restaurant"]),
  async (req, res) => {
    const {
      name,
      description,
      price,
      image_url,
      category_id,
      available = true,
    } = req.body;
    const status = "pending";

    try {
      const [result] = await db.execute(
        "INSERT INTO menu_items (name, description, price, image_url, category_id, available, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, description, price, image_url, category_id, available, status]
      );
      res.json({ message: "Thêm món ăn thành công", id: result.insertId });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Thêm món không thành công", error: err.message });
    }
  },
];

exports.updateMenuItem = [
  verifyToken,
  requireRole(["restaurant"]),
  async (req, res) => {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      image_url,
      category_id,
      available = true,
    } = req.body;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const [updateResult] = await connection.execute(
        `UPDATE menu_items 
         SET name = ?, description = ?, price = ?, image_url = ?, category_id = ?, available = ? 
         WHERE id = ?`,
        [name, description, price, image_url, category_id, available, id]
      );

      if (updateResult.affectedRows === 0) {
        await connection.rollback();
        return res
          .status(404)
          .json({ message: "Không tìm thấy món ăn để cập nhật" });
      }

      const [rows] = await connection.execute(
        `SELECT m.*, c.name AS category_name 
         FROM menu_items m 
         LEFT JOIN categories c ON m.category_id = c.id
         WHERE m.id = ?`,
        [id]
      );

      await connection.commit();

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy món ăn sau khi cập nhật" });
      }

      res.json({
        message: "Cập nhật món ăn thành công",
        menuItem: rows[0],
      });
    } catch (err) {
      await connection.rollback();
      res.status(500).json({
        message: "Cập nhật món không thành công",
        error: err.message,
      });
    } finally {
      connection.release();
    }
  },
];

exports.deleteMenuItem = [
  verifyToken,
  requireRole(["restaurant"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      // Xóa các món liên quan trong bảng khác trước (nếu có)
      await db.execute("DELETE FROM cart_items WHERE menu_item_id = ?", [id]);
      await db.execute("DELETE FROM order_items WHERE menu_item_id = ?", [id]);

      // Xóa món chính
      const [result] = await db.execute("DELETE FROM menu_items WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy món ăn để xoá" });
      }

      res.json({ message: "Đã xoá món ăn thành công" });
    } catch (err) {
      console.error("Lỗi khi xoá món ăn:", err);
      res.status(500).json({
        message: "Xóa món không thành công",
        error: err.message,
      });
    }
  },
];

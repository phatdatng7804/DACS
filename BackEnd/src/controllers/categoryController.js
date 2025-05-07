const db = require("../Models/Db");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM categories ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách danh mục", error: err.message });
  }
};
// Thêm vào loại mới
exports.addCategory = async (req, res) => {
  // Kiểm tra quyền của người dùng
  if (req.user.role !== "restaurant") {
    return res
      .status(403)
      .json({ message: "Bạn không có quyền thêm danh mục" });
  }

  const { name } = req.body;
  if (!name)
    return res
      .status(400)
      .json({ message: "Tên danh mục không được để trống" });
  try {
    const [result] = await db.execute(
      "INSERT INTO categories (name) VALUES (?)",
      [name]
    );
    res.json({
      message: "Thêm danh mục thành công",
      categoryId: result.insertId,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi thêm danh mục", error: err.message });
  }
};
// sửa loại sản phẩm
exports.updateCategory = async (req, res) => {
  // Kiểm tra quyền của người dùng
  if (req.user.role !== "restaurant") {
    return res.status(403).json({ message: "Bạn không có quyền sửa danh mục" });
  }

  const { id } = req.params;
  const { name } = req.body;
  if (!name)
    return res
      .status(400)
      .json({ message: "Tên danh mục không được để trống" });
  try {
    await db.execute("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
    res.json({
      message: "Cập nhật danh mục thành công",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật danh mục", error: err.message });
  }
};

// Xóa loại sản phẩm
exports.deleteCategory = async (req, res) => {
  // Kiểm tra quyền của người dùng
  if (req.user.role !== "restaurant") {
    return res.status(403).json({ message: "Bạn không có quyền xóa danh mục" });
  }

  const { id } = req.params;
  try {
    await db.execute("DELETE FROM categories WHERE id = ?", [id]);
    res.json({
      message: "Xóa danh mục thành công",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa danh mục", error: err.message });
  }
};

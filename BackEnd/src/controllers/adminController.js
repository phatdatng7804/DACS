const db = require("../Models/Db");
const bcrypt = require("bcryptjs");

exports.getUsers = async (req, res) => {
  const { role } = req.query; // role = 'customer' hoặc 'restaurant' hoặc 'admin'...
  try {
    let sql = "SELECT id, name, email, phone, role FROM users";
    const params = [];

    if (role) {
      sql += " WHERE role = ?";
      params.push(role);
    }

    const [users] = await db.execute(sql, params);
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng" });
  }
};
exports.createUserWithRole = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  // Kiểm tra role hợp lệ
  if (!["admin", "staff", "customer", "restaurant"].includes(role)) {
    return res.status(400).json({ message: "Role không hợp lệ" });
  }

  // Kiểm tra các trường bắt buộc
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  try {
    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Thêm user vào DB
    const [result] = await db.execute(
      `INSERT INTO users (name, email, phone, password, role)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, hashedPassword, role]
    );

    res.status(201).json({
      message: `Tạo tài khoản ${role} thành công`,
      userId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi khi tạo người dùng", error: error.message });
  }
};
// Xóa người dùng theo id
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM cart_items WHERE customer_id = ?", [id]);
    // Xóa tất cả order của user trước
    await db.execute("DELETE FROM orders WHERE customer_id = ?", [id]);
    // Sau đó xóa user
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.json({ message: "Xóa người dùng thành công" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Lỗi khi xóa người dùng", error: err.message });
  }
};

// Lấy danh sách đánh giá đang chờ duyệt
exports.getPendingReviews = async (req, res) => {
  try {
    const [items] = await db.execute(
      `SELECT m.id, m.name, m.description, m.price, m.image_url, m.category_id, m.available, m.status, c.name AS category_name
       FROM menu_items m
       LEFT JOIN categories c ON m.category_id = c.id
       WHERE m.status = 'pending'
       ORDER BY m.created_at DESC`
    );
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách món ăn chờ duyệt" });
  }
};

// Duyệt hoặc từ chối món ăn
exports.updateMenuItemStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' hoặc 'rejected'
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });

  try {
    // Lấy trạng thái hiện tại
    const [rows] = await db.execute(
      "SELECT status FROM menu_items WHERE id = ?",
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Món ăn không tồn tại" });

    if (rows[0].status !== "pending")
      return res
        .status(400)
        .json({ message: "Chỉ được duyệt/từ chối món ăn đang chờ duyệt" });

    const [result] = await db.execute(
      "UPDATE menu_items SET status = ? WHERE id = ?",
      [status, id]
    );
    res.json({ message: `Món ăn đã được cập nhật: ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái món" });
  }
};

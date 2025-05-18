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
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.json({ message: "Xóa người dùng thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi xóa người dùng" });
  }
};

// Lấy danh sách đánh giá đang chờ duyệt
exports.getPendingReviews = async (req, res) => {
  try {
    const [reviews] = await db.execute(
      `SELECT r.id, r.content, r.rating, r.status, r.created_at, u.name AS userName, m.name AS menuItemName
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN menu_items m ON r.menu_item_id = m.id
      WHERE r.status = 'pending'
      ORDER BY r.created_at DESC`
    );
    res.json({ reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy đánh giá" });
  }
};

// Duyệt hoặc từ chối đánh giá
exports.reviewApproveOrReject = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // status = 'approved' hoặc 'rejected'
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });

  try {
    const [result] = await db.execute(
      "UPDATE reviews SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Đánh giá không tồn tại" });

    res.json({ message: `Đánh giá đã được ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi cập nhật đánh giá" });
  }
};
// Duyệt hoặc từ chối món ăn
exports.updateMenuItemStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' hoặc 'rejected'
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });

  try {
    const [result] = await db.execute(
      "UPDATE menu_items SET status = ? WHERE id = ?",
      [status, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Món ăn không tồn tại" });

    res.json({ message: `Món ăn đã được cập nhật: ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái món" });
  }
};

const db = require("../Models/Db");
const bcrypt = require("bcryptjs");

exports.createUserWithRole = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!["admin", "restaurant"].includes(role)) {
    return res.status(400).json({ message: "Role không hợp lệ" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, hashedPassword, role]
    );

    res.json({
      message: `Tạo tài khoản ${role} thành công`,
      userId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Lỗi khi tạo người dùng", error: err.message });
  }
};

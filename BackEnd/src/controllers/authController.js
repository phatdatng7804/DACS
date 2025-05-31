const db = require("../Models/Db");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!name || !email || !phone || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập đầy đủ thông tin đăng ký" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Đăng ký người dùng vào bảng users
    const [result] = await db.execute(
      "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, hashedPassword, "customer"]
    );

    // Thêm thông tin vào bảng userInfo
    await db.execute(
      "INSERT INTO userInfo (user_id, name, phone, address, gender) VALUES (?, ?, ?, ?, ?)",
      [result.insertId, name, phone, null, null]
    );

    res.json({ message: "Đăng ký thành công", userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đăng ký thất bại", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE phone = ?", [
      phone,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Tài khoản không tồn tại" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Xoá các token cũ (nếu muốn, optional)
    await db.execute("DELETE FROM user_tokens WHERE user_id = ?", [user.id]);

    //  Lưu token mới vào bảng user_tokens
    await db.execute("INSERT INTO user_tokens (user_id, token) VALUES (?, ?)", [
      user.id,
      token,
    ]);

    // Trả kết quả
    res.json({
      message: "Đăng nhập thành công",
      token,
      userId: user.id,
      role: user.role,
      name: user.name,
      phone: user.phone,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đăng nhập thất bại", error: err.message });
  }
};
exports.updateUserInfo = async (req, res) => {
  const { userId, address, gender, name } = req.body;

  try {
    await db.execute(
      "UPDATE userInfo SET address = ?, gender = ?, name = ? WHERE user_id = ?",
      [address, gender, name, userId]
    );

    res.json({ message: "Thông tin đã được cập nhật thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Cập nhật thông tin thất bại",
      error: err.message,
    });
  }
};

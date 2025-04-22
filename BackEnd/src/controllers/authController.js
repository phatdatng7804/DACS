const db = require("../Models/Db");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, hashedPassword, "customer"]
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
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đăng nhập thất bại", error: err.message });
  }
};

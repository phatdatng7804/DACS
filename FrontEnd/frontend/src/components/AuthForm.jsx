import React, { useState } from "react";
import "./AuthForm.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Thêm BASE_URL để gọi đến backend trên Render
    const BASE_URL = "https://dacs-u2d2.onrender.com";
    const endpoint = isLogin
      ? `${BASE_URL}/auth/login`
      : `${BASE_URL}/auth/register`;

    const payload = isLogin
      ? {
          phone: form.phone,
          password: form.password,
        }
      : {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(data.message);
      if (isLogin) {
        localStorage.setItem("token", data.token);
      }
    } catch (err) {
      alert(err.message || "Lỗi xảy ra!");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? "Đăng nhập" : "Đăng ký"}</button>
      </form>
      <p>
        {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
        <span className="toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Đăng ký" : "Đăng nhập"}
        </span>
      </p>
    </div>
  );
};

export default AuthForm;

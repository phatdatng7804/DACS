const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Không có token đăng nhập" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ví dụ: { id: 1, role: 'admin', iat: ..., exp: ... }
    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};

const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res
      .status(401)
      .json({ message: "Bạn chưa đăng nhập!Vui lòng đăng nhập để tiếp tục" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res
      .status(403)
      .json({ message: "Đăng nhập không hợp lệ sai mật khẩu hoặc tài khoản" });
  }
};

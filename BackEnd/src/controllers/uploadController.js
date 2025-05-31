const multer = require("multer");
const path = require("path");

// Cấu hình lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Khởi tạo multer upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Controller xử lý upload
const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Chưa chọn file ảnh" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    return res.json({ url: imageUrl });
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    return res.status(500).json({ message: "Lỗi server khi upload ảnh" });
  }
};
module.exports = {
  upload,
  uploadImage,
};

const express = require("express");
const router = express.Router();

const { upload, uploadImage } = require("../controllers/uploadController");

// Upload ảnh 1 file, field name là "file"
router.post("/upload-image", upload.single("image"), uploadImage);

module.exports = router;

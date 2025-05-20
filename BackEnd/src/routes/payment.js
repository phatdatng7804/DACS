const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Đặt hàng (COD hoặc tạo link VNPAY)
router.post("/place-order", paymentController.placeOrder);

// Xử lý callback sau khi thanh toán từ VNPAY
router.get("/payment-return", paymentController.vnpayReturn);

module.exports = router;

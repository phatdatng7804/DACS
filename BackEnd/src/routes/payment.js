const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Đặt hàng (COD hoặc tạo link VNPAY)
/**
 * @swagger
 * /payment/place-order:
 *   post:
 *     summary: Đặt hàng (thanh toán COD hoặc tạo link thanh toán VNPAY)
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - paymentMethod
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 123
 *               paymentMethod:
 *                 type: string
 *                 enum: [cod, vnpay]
 *                 example: vnpay
 *     responses:
 *       200:
 *         description: Đặt hàng thành công hoặc trả về URL thanh toán
 *       400:
 *         description: Thiếu thông tin đặt hàng
 *       500:
 *         description: Lỗi khi xử lý đơn hàng
 */
router.post("/place-order", paymentController.placeOrder);

// Xử lý callback sau khi thanh toán từ VNPAY
/**
 * @swagger
 * /payment/payment-return:
 *   get:
 *     summary: Xử lý callback từ VNPAY sau khi thanh toán
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: vnp_Amount
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_OrderInfo
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_SecureHash
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về kết quả giao dịch (thành công/thất bại)
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi xử lý callback VNPAY
 */
router.get("/payment-return", paymentController.vnpayReturn);

module.exports = router;

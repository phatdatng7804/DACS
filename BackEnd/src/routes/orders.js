const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

const { createOrder } = require("../controllers/ordersController");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API cho khách hàng tạo đơn hàng
 */

/**
 * @swagger
 * /orders/create-order:
 *   post:
 *     summary: Tạo đơn hàng mới (Khách hàng)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Khách hàng tạo một đơn hàng mới với danh sách món ăn, phương thức thanh toán và địa chỉ giao hàng.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - order_type
 *               - payment_method
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [menu_item_id, quantity, price]
 *                   properties:
 *                     menu_item_id:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               order_type:
 *                 type: string
 *                 example: "delivery"
 *               delivery_address:
 *                 type: string
 *                 example: "123 Lê Văn Việt, Quận 9"
 *               payment_method:
 *                 type: string
 *                 example: "momo"
 *     responses:
 *       200:
 *         description: Đặt món thành công
 *       400:
 *         description: Thiếu thông tin bắt buộc
 *       500:
 *         description: Lỗi server
 */
router.post("/create-order", verifyToken, createOrder);

module.exports = router;

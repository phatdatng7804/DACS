const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const {
  createOrder,
  updateOrderStatus,
} = require("../controllers/ordersController");

/**
 * @swagger
 * /orders/create-order:
 *   post:
 *     summary: Đặt món ăn mới (tạo đơn hàng)
 *     tags: [Orders]
 *     description: "Tạo một đơn hàng mới cho khách hàng, bao gồm thông tin món ăn, phương thức thanh toán, địa chỉ giao hàng."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - items
 *               - total_amount
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menu_item_id:
 *                       type: integer
 *                       example: 3
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               total_amount:
 *                 type: number
 *                 example: 90000
 *               note:
 *                 type: string
 *                 example: "Không hành, giao buổi sáng"
 *     responses:
 *       200:
 *         description: Tạo đơn hàng thành công
 *       400:
 *         description: "Dữ liệu yêu cầu không hợp lệ (Ví dụ: thiếu thông tin bắt buộc)"
 *       500:
 *         description: "Lỗi khi tạo đơn hàng"
 */
router.post("/create-order", verifyToken, createOrder);
/**
 * @swagger
 * /orders/{orderId}/status:
 *   put:
 *     summary: Cập nhật trạng thái đơn hàng
 *     tags: [Orders]
 *     description:" Cập nhật trạng thái đơn hàng (Ví dụ: từ 'pending' sang 'confirmed' hoặc 'preparing')."
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đơn hàng cần cập nhật trạng thái
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, ready, delivered, cancelled]
 *                 example: "confirmed"
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái đơn hàng thành công
 *       400:
 *         description: Trạng thái không hợp lệ
 *       403:
 *         description: Không có quyền truy cập hoặc không phải là nhà hàng
 *       500:
 *         description: Lỗi khi cập nhật trạng thái đơn hàng
 */

router.put(
  "/orders/:orderId/status",
  verifyToken,
  requireRole(["restaurant"]),
  updateOrderStatus
);
module.exports = router;

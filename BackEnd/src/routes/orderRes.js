const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

const {
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/ordersController");

/**
 * @swagger
 * tags:
 *   name: RestaurantOrders
 *   description: API quản lý đơn hàng dành cho restaurant
 */

/**
 * @swagger
 * /restaurant/orders/{orderId}/status:
 *   put:
 *     summary: Cập nhật trạng thái đơn hàng
 *     tags: [RestaurantOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đơn hàng cần cập nhật
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
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       400:
 *         description: Trạng thái không hợp lệ
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.put(
  "/:orderId/status",
  verifyToken,
  requireRole(["restaurant"]),
  updateOrderStatus
);

/**
 * @swagger
 * /restaurant/orders:
 *   get:
 *     summary: Lấy tất cả đơn hàng
 *     tags: [RestaurantOrders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       order_id:
 *                         type: integer
 *                       customer_id:
 *                         type: integer
 *                       customer_name:
 *                         type: string
 *                       order_type:
 *                         type: string
 *                       delivery_address:
 *                         type: string
 *                       status:
 *                         type: string
 *                       total_amount:
 *                         type: number
 *                       payment_method:
 *                         type: string
 *                       is_paid:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       403:
 *         description: Không có quyền truy cập
 */
router.get("/", verifyToken, requireRole(["restaurant"]), getAllOrders);

module.exports = router;

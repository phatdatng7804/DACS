const express = require("express");
const router = express.Router();

const { createOrder } = require("../controllers/ordersController");

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Đặt món ăn mới (tạo đơn hàng)
 *     tags: [Orders]
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
 *                 example: Không hành, giao buổi sáng
 *     responses:
 *       200:
 *         description: Tạo đơn hàng thành công
 */
router.post("/", createOrder);

module.exports = router;

const express = require("express");
const router = express.Router();

const { processPayment } = require("../controllers/paymentController");
/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Thực hiện thanh toán đơn hàng
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderInfo
 *             properties:
 *               orderInfo:
 *                 type: object
 *                 properties:
 *                   orderId:
 *                     type: integer
 *                     example: 123
 *                   amount:
 *                     type: number
 *                     example: 120000
 *                   method:
 *                     type: string
 *                     example: vnpay
 *     responses:
 *       200:
 *         description: Thanh toán thành công
 */
router.post("/", processPayment);

module.exports = router;

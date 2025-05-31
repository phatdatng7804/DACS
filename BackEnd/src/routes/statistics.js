const express = require("express");
const router = express.Router();
const { getStatisticsOfMonth } = require("../controllers/statisticsController");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
/**
 * @swagger
 * /admin/statistics/best-seller:
 *   get:
 *     summary: Lấy món ăn bán chạy nhất trong tháng
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     description: Trả về món ăn được đặt nhiều nhất trong tháng hiện tại (theo số lượng)
 *     responses:
 *       200:
 *         description: Thông tin món bán chạy nhất
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 best_seller:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     menu_item_id:
 *                       type: integer
 *                       example: 5
 *                     menu_name:
 *                       type: string
 *                       example: "Cơm gà chiên"
 *                     quantity_sold:
 *                       type: integer
 *                       example: 87
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get(
  "/best-seller",
  verifyToken,
  requireRole(["admin", "restaurant"]),
  getStatisticsOfMonth
);

module.exports = router;

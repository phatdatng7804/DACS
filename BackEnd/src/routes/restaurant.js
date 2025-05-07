const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const rc = require("../controllers/restaurantController");

/**
 * @swagger
 * /restaurant/menu:
 *   get:
 *     summary: Lấy toàn bộ menu (gồm cả tên loại món) cho nhà hàng quản lý
 *     tags: [Restaurant]
 *     responses:
 *       200:
 *         description: Lấy menu thành công
 */
router.get("/menu", verifyToken, requireRole(["restaurant"]), rc.getAllMenu);
/**
 * @swagger
 * /restaurant/menu:
 *   post:
 *     summary: Thêm món ăn mới vào menu
 *     tags: [Restaurant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cơm gà xối mỡ
 *               description:
 *                 type: string
 *                 example: Cơm gà giòn, ăn kèm nước mắm
 *               price:
 *                 type: number
 *                 example: 45000
 *               image_url:
 *                 type: string
 *                 example: http://example.com/comga.jpg
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               available:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Thêm món thành công
 */
router.post("/menu", verifyToken, requireRole(["restaurant"]), rc.addMenuItem);
/**
 * @swagger
 * /restaurant/menu/{id}:
 *   put:
 *     summary: Sửa món ăn trong menu
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID món ăn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cơm tấm
 *               description:
 *                 type: string
 *                 example: Cơm tấm sườn bì chả
 *               price:
 *                 type: number
 *                 example: 50000
 *               image_url:
 *                 type: string
 *                 example: http://example.com/comtam.jpg
 *               category_id:
 *                 type: integer
 *                 example: 2
 *               available:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Sửa món thành công
 */
router.put(
  "/menu/:id",
  verifyToken,
  requireRole(["restaurant"]),
  rc.updateMenuItem
);
/**
 * @swagger
 * /restaurant/menu/{id}:
 *   delete:
 *     summary: Xoá món ăn khỏi menu
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID món ăn
 *     responses:
 *       200:
 *         description: Xoá món thành công
 */
router.delete(
  "/menu/:id",
  verifyToken,
  requireRole(["restaurant"]),
  rc.deleteMenuItem
);

module.exports = router;

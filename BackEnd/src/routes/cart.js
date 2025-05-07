const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifyToken } = require("../middleware/auth");
// Thêm món vào giỏ hàng
/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Thêm món vào giỏ hàng
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - menu_item_id
 *               - quantity
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               menu_item_id:
 *                 type: integer
 *                 example: 3
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Thêm món vào giỏ hàng thành công
 *       400:
 *         description: Thiếu thông tin bắt buộc hoặc thông tin không hợp lệ
 *       500:
 *         description: Lỗi khi thêm món vào giỏ hàng
 */
router.post("/add", verifyToken, cartController.addToCart);
/**
 * @swagger
 * /cart/{user_id}:
 *   get:
 *     summary: Lấy danh sách giỏ hàng của người dùng
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Lấy danh sách giỏ hàng thành công
 *       404:
 *         description: Không tìm thấy giỏ hàng của người dùng
 *       500:
 *         description: Lỗi khi lấy giỏ hàng
 */
router.get("/:user_id", verifyToken, cartController.getCart);
/**
 * @swagger
 * /cart/update/{id}:
 *   put:
 *     summary: Cập nhật số lượng món trong giỏ hàng
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của món trong giỏ hàng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cập nhật số lượng món trong giỏ hàng thành công
 *       400:
 *         description: Số lượng không hợp lệ
 *       500:
 *         description: Lỗi khi cập nhật giỏ hàng
 */
router.put("/update/:id", verifyToken, cartController.updateCartItem);
/**
 * @swagger
 * /cart/delete/{id}:
 *   delete:
 *     summary: Xoá món khỏi giỏ hàng
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của món cần xoá khỏi giỏ hàng
 *     responses:
 *       200:
 *         description: Xoá món khỏi giỏ hàng thành công
 *       404:
 *         description: Không tìm thấy món cần xoá
 *       500:
 *         description: Lỗi khi xoá món khỏi giỏ hàng
 */
router.delete("/delete/:id", verifyToken, cartController.deleteCartItem);

module.exports = router;

const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  register,
  login,
  updateUserInfo,
  getUserInfo,
} = require("../controllers/authController");
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               phone:
 *                 type: string
 *                 example: 0987654321
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 */
router.post("/register", register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập tài khoản
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: 0987654321
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
router.post("/login", login);
/**
 * @swagger
 * /auth/update-user-info:
 *   patch:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 example: 123 Đường ABC, Quận 1, TP.HCM
 */
router.patch("/update-user-info", updateUserInfo);
/**
 * @swagger
 * /auth/info:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []     # yêu cầu Bearer token trong header Authorization
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userInfo:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Nguyễn Văn A
 *                     phone:
 *                       type: string
 *                       example: 0987654321
 *                     address:
 *                       type: string
 *                       example: 123 Đường ABC, Quận 1, TP.HCM
 *                     gender:
 *                       type: string
 *                       example: Nam
 *       401:
 *         description: Chưa đăng nhập hoặc thiếu token
 *       403:
 *         description: Token không hợp lệ hoặc hết hạn
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/info", verifyToken, getUserInfo);
module.exports = router;

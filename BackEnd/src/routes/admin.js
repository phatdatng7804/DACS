const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

/**
 * @swagger
 * /api/admin/create-user:
 *   post:
 *     summary: Admin tạo tài khoản người dùng có role (admin hoặc staff)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyễn Văn Quản Trị
 *               email:
 *                 type: string
 *                 example: admin@restaurant.vn
 *               phone:
 *                 type: string
 *                 example: 0912345678
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum: [admin, staff]
 *                 example: admin
 *     responses:
 *       200:
 *         description: Tạo tài khoản thành công
 *       400:
 *         description: Role không hợp lệ
 *       401:
 *         description: Không có token đăng nhập
 *       403:
 *         description: Token không hợp lệ hoặc không phải admin
 *       500:
 *         description: Tạo tài khoản thất bại
 */
router.post(
  "/create-user",
  verifyToken,
  requireRole(["admin"]),
  adminController.createUserWithRole
);
module.exports = router;

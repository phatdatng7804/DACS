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
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Lấy danh sách người dùng (có thể lọc theo role)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, staff, customer, restaurant]
 *         description: Lọc theo role người dùng (tùy chọn)
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       role:
 *                         type: string
 *       401:
 *         description: Không có token đăng nhập
 *       403:
 *         description: Token không hợp lệ hoặc không phải admin
 *       500:
 *         description: Lỗi server khi lấy danh sách người dùng
 */
router.get(
  "/users",
  verifyToken,
  requireRole(["admin"]),
  adminController.getUsers
);
/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Xóa người dùng theo ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID người dùng cần xóa
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *       401:
 *         description: Không có token đăng nhập
 *       403:
 *         description: Token không hợp lệ hoặc không phải admin
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi server khi xóa người dùng
 */
router.delete(
  "/users/:id",
  verifyToken,
  requireRole(["admin"]),
  adminController.deleteUser
);
/**
 * @swagger
 * /api/admin/reviews/pending:
 *   get:
 *     summary: Lấy danh sách đánh giá món ăn đang chờ duyệt
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đánh giá chờ duyệt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       rating:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       userName:
 *                         type: string
 *                       menuItemName:
 *                         type: string
 *       401:
 *         description: Không có token đăng nhập
 *       403:
 *         description: Token không hợp lệ hoặc không phải admin
 *       500:
 *         description: Lỗi server khi lấy đánh giá
 */
router.get(
  "/reviews/pending",
  verifyToken,
  requireRole(["admin"]),
  adminController.getPendingReviews
);
router.patch(
  "/menu-items/:id/status",
  verifyToken,
  requireRole(["admin"]),
  adminController.updateMenuItemStatus
);

module.exports = router;

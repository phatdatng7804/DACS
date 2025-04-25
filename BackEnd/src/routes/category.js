const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
/**
 * @swagger
 * /category:
 *   get:
 *     summary: Lấy tất cả category
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Lấy danh sách category thành công
 */
router.get("/", getAllCategories);

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Thêm mới một category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Món chính
 *     responses:
 *       200:
 *         description: Thêm category thành công
 */
router.post("/", addCategory);

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Sửa thông tin category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Đồ uống
 *     responses:
 *       200:
 *         description: Cập nhật category thành công
 */
router.put("/:id", updateCategory);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Xoá category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID category
 *     responses:
 *       200:
 *         description: Xoá category thành công
 */
router.delete("/:id", deleteCategory);
module.exports = router;

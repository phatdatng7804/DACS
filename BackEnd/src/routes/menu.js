const express = require("express");
const router = express.Router();

const { getMenu } = require("../controllers/menuController");
/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Lấy danh sách menu (cho khách hàng)
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Lấy danh sách menu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Phở bò
 *                   description:
 *                     type: string
 *                     example: Món phở bò truyền thống
 *                   price:
 *                     type: number
 *                     example: 45000
 *                   image_url:
 *                     type: string
 *                     example: http://example.com/pho.jpg
 *                   available:
 *                     type: boolean
 *                     example: true
 *                   category_id:
 *                     type: integer
 *                     example: 1
 *                   category_name:
 *                     type: string
 *                     example: Món chính
 */
router.get("/", getMenu);

module.exports = router;

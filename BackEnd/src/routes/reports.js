const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const reportController = require("../controllers/reportController");

router.post("/reports", verifyToken, reportController.createReport);
module.exports = router;

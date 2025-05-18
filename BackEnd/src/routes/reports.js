const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const adminController = require("../controllers/reportController");

router.post("/reports", verifyToken, reportController.createReport);

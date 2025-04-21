const express = require("express");
const router = express.Router();

// Gọi controller
const { processPayment } = require("../controllers/paymentController");

// Route: POST /payment
router.post("/", processPayment);

module.exports = router;

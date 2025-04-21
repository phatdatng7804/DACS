const express = require("express");
const router = express.Router();

// Gọi controller
const { createOrder } = require("../controllers/ordersController");

// Route: POST /orders
router.post("/", createOrder);

module.exports = router;

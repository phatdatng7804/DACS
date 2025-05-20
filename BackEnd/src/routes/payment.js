const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/create-payment", paymentController.processPayment);
router.get("/vnpay_return", paymentController.vnpayReturn);
module.exports = router;

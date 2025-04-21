const axios = require("axios");
exports.processPayment = async (req, res) => {
  const { orderInfo } = req.body;
  try {
    const response = await axios.post(
      "https://api.vnpay.vn/payment",
      orderInfo
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Thanh toán thất bại", error: error.message });
  }
};

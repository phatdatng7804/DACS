const { createVnpayUrl } = require("./vnpayService"); // Đảm bảo đúng đường dẫn
require("dotenv").config();

// Tạo URL thanh toán VNPAY
exports.processPayment = async (req, res) => {
  try {
    const { amount, orderId, orderDesc } = req.body;

    if (!amount || !orderId || !orderDesc) {
      return res.status(400).json({ message: "Thiếu thông tin thanh toán" });
    }

    const paymentUrl = createVnpayUrl({ amount, orderId, orderDesc });

    return res.json({ paymentUrl });
  } catch (error) {
    console.error("Lỗi khi tạo URL thanh toán:", error);
    res.status(500).json({
      message: "Lỗi khi xử lý thanh toán",
      error: error.message,
    });
  }
};

// Xử lý trang trả về sau khi thanh toán từ VNPAY (vnp_ReturnUrl)
exports.vnpayReturn = (req, res) => {
  const queryData = req.query;
  const secureHash = queryData.vnp_SecureHash;
  delete queryData.vnp_SecureHash;
  delete queryData.vnp_SecureHashType;

  const crypto = require("crypto");
  const qs = require("qs");

  const secretKey = process.env.VNP_HASHSECRET;
  const sortedParams = Object.keys(queryData)
    .sort()
    .reduce((result, key) => {
      result[key] = queryData[key];
      return result;
    }, {});
  const signData = qs.stringify(sortedParams, { encode: false });
  const hash = crypto
    .createHmac("sha512", secretKey)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  if (secureHash === hash) {
    // ✅ Dữ liệu hợp lệ, có thể xử lý lưu đơn hàng tại đây nếu muốn
    res.send("✅ Thanh toán thành công: " + JSON.stringify(queryData));
  } else {
    res.status(400).send("❌ Dữ liệu không hợp lệ (sai chữ ký)");
  }
};

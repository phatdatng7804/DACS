const db = require("../Models/Db");

exports.createOrder = async (req, res) => {
  const {
    customer_id,
    restaurant_id,
    items,
    order_type,
    delivery_address,
    payment_method,
  } = req.body;

  const [result] = await db.execute(
    "INSERT INTO orders (customer_id, restaurant_id, order_type, delivery_address, status, total_amount, payment_method, is_paid) VALUES (?, ?, ?, ?, 'pending', ?, ?, 0)",
    [
      customer_id,
      restaurant_id,
      order_type,
      delivery_address,
      0,
      payment_method,
    ]
  );
  const orderId = result.insertId;

  for (let item of items) {
    await db.execute(
      "INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)",
      [orderId, item.menu_item_id, item.quantity, item.price]
    );
  }

  res.json({ message: "Đặt món thành công", orderId });
};
/*
exports.createOrder = (req, res) => {
  const { items, customer_id } = req.body;

  // In ra để kiểm tra khi test
  console.log("📦 Đơn hàng nhận được:", { customer_id, items });

  res.json({
    message: "Đặt món thành công!",
    data: {
      customer_id,
      items,
    },
  });
};
const axios = require("axios");

exports.processPayment = async (req, res) => {
  const { orderInfo } = req.body;

  try {
    // Đây là API giả lập - dùng để test gửi request
    const response = await axios.post("https://httpbin.org/post", orderInfo);

    res.json({
      message: "Thanh toán thành công (demo)",
      data: response.data.json,
    });
  } catch (error) {
    res.status(500).json({
      message: "Thanh toán thất bại",
      error: error.message,
    });
  }
};
*/

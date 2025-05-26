const db = require("../Models/Db");
const { createPaymentUrl, validateVnpayResponse } = require("./vnpayService");
require("dotenv").config();

// Đặt hàng COD hoặc tạo link VNPAY
exports.placeOrder = async (req, res) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();
  try {
    const {
      customer_id,
      order_type,
      delivery_address,
      amount,
      orderDesc,
      paymentMethod,
      items, // Danh sách món được gửi từ FE
    } = req.body;

    // 1. Tạo đơn hàng (chưa thanh toán)
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (customer_id, order_type, delivery_address, total_amount, payment_method, is_paid, status)
       VALUES (?, ?, ?, ?, ?, 0, 'pending')`,
      [
        customer_id,
        order_type,
        delivery_address,
        amount,
        paymentMethod.toLowerCase(),
      ]
    );

    const orderId = orderResult.insertId;

    // 2. Thêm các món vào order_items
    for (const item of items) {
      const [menuRow] = await connection.execute(
        "SELECT price FROM menu_items WHERE id = ?",
        [item.menu_item_id]
      );

      if (menuRow.length === 0) {
        throw new Error(`Món ăn không tồn tại: ID ${item.menu_item_id}`);
      }

      const price = menuRow[0].price;

      await connection.execute(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.menu_item_id, item.quantity, price]
      );
    }

    // 3. Nếu chọn thanh toán VNPAY
    if (paymentMethod.toLowerCase() === "vnpay") {
      const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const paymentUrl = createPaymentUrl(
        {
          order_id: orderId.toString(),
          amount,
          order_desc: orderDesc,
          order_type: "other",
        },
        ipAddr
      );

      await connection.commit();
      return res.json({
        message: "Đặt hàng thành công, chuyển đến VNPAY",
        paymentUrl,
      });
    }

    // 4. Trường hợp COD
    await connection.commit();
    res.json({ message: "Đặt hàng thành công với COD", orderId });
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi khi đặt hàng:", error);
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: error.message });
  } finally {
    connection.release();
  }
};

// Xử lý callback từ VNPAY
exports.vnpayReturn = async (req, res) => {
  try {
    const result = validateVnpayResponse(req.query);
    if (result.status === "invalid") {
      return res.status(400).send("❌ Dữ liệu không hợp lệ (sai chữ ký)");
    }

    const orderId = result.order_id;

    // ✅ Cập nhật đơn hàng trong DB
    await db.execute(
      "UPDATE orders SET is_paid = 1, payment_time = NOW(), status = 'confirmed' WHERE id = ?",
      [orderId]
    );

    res.send(" Thanh toán thành công qua VNPAY, đơn hàng đã xác nhận");
  } catch (error) {
    console.error(error);
    res.status(500).send(" Lỗi xử lý phản hồi VNPAY");
  }
};

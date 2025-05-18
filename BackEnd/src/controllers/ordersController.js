const db = require("../Models/Db");
const moment = require("moment");

exports.createOrder = async (req, res) => {
  const { customer_id, items, order_type, delivery_address, payment_method } =
    req.body;

  // Kiểm tra đầu vào
  if (!customer_id || !order_type || !payment_method || !Array.isArray(items)) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  // Tính tổng số tiền
  const total_amount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Kiểm tra số lượng món ăn hợp lệ
  if (total_amount <= 0) {
    return res.status(400).json({ message: "Tổng số tiền không hợp lệ" });
  }

  try {
    // Tạo đơn hàng mới
    const [result] = await db.execute(
      "INSERT INTO orders (customer_id, order_type, delivery_address, status, total_amount, payment_method, is_paid) VALUES (?, ?, ?, 'pending', ?, ?, 0)",
      [customer_id, order_type, delivery_address, total_amount, payment_method]
    );
    const orderId = result.insertId;

    // Thêm món ăn vào bảng order_items
    for (let item of items) {
      await db.execute(
        "INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.menu_item_id, item.quantity, item.price]
      );
    }

    // Cập nhật bảng statistics
    const today = moment().format("YYYY-MM-DD");

    await db.execute(
      `INSERT INTO statistics (date, total_orders, total_revenue)
       VALUES (?, 1, ?)
       ON DUPLICATE KEY UPDATE
         total_orders = total_orders + 1,
         total_revenue = total_revenue + VALUES(total_revenue)`,
      [today, total_amount]
    );

    res.json({ message: "Đặt món thành công", orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đặt món thất bại", error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }

  // Kiểm tra quyền của người dùng (chỉ nhà hàng mới có quyền cập nhật trạng thái)
  if (req.user.role !== "restaurant") {
    return res
      .status(403)
      .json({ message: "Bạn không có quyền cập nhật trạng thái đơn hàng" });
  }

  try {
    const [result] = await db.execute(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json({
      message: `Đã cập nhật trạng thái đơn hàng thành công: ${status}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Lỗi khi cập nhật trạng thái đơn hàng",
      error: err.message,
    });
  }
};

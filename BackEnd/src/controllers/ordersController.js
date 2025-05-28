const db = require("../Models/Db");
const moment = require("moment");

exports.createOrder = async (req, res) => {
  const customer_id = req.user.id;
  const {
    order_type,
    items,
    delivery_address,
    payment_method = "cod",
  } = req.body;

  if (
    !customer_id ||
    !order_type ||
    !payment_method ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin bắt buộc hoặc danh sách món trống" });
  }

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    let total_amount = 0;
    const detailedItems = [];

    for (const item of items) {
      const [menuRows] = await connection.execute(
        "SELECT price FROM menu_items WHERE id = ?",
        [item.menu_item_id]
      );

      if (menuRows.length === 0) {
        await connection.rollback();
        return res
          .status(400)
          .json({ message: `Món ăn ID ${item.menu_item_id} không tồn tại` });
      }

      const unitPrice = menuRows[0].price;
      const itemTotal = unitPrice * item.quantity;
      total_amount += itemTotal;

      detailedItems.push({
        ...item,
        price: unitPrice,
      });
    }

    // Xác định trạng thái thanh toán ban đầu
    const isPaid = payment_method.toLowerCase() === "cod" ? 0 : 0; // thanh toán sau, xác nhận ở route riêng

    const [result] = await connection.execute(
      "INSERT INTO orders (customer_id, order_type, delivery_address, status, total_amount, payment_method, is_paid) VALUES (?, ?, ?, 'pending', ?, ?, ?)",
      [
        customer_id,
        order_type,
        delivery_address,
        total_amount,
        payment_method.toLowerCase(),
        isPaid,
      ]
    );
    const orderId = result.insertId;

    for (let item of detailedItems) {
      await connection.execute(
        "INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.menu_item_id, item.quantity, item.price]
      );
    }

    const today = moment().format("YYYY-MM-DD");
    await connection.execute(
      `INSERT INTO statistics (date, total_orders, total_revenue)
       VALUES (?, 1, ?)
       ON DUPLICATE KEY UPDATE
         total_orders = total_orders + 1,
         total_revenue = total_revenue + VALUES(total_revenue)`,
      [today, total_amount]
    );

    await connection.commit();

    res.json({
      message: "Đặt món thành công",
      orderId,
      payment_method: payment_method.toLowerCase(),
    });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Đặt món thất bại", error: err.message });
  } finally {
    connection.release();
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    // Lấy danh sách đơn hàng
    const [orders] = await db.execute(`
      SELECT 
        o.id AS order_id,
        o.customer_id,
        u.name AS customer_name,
        o.order_type,
        o.delivery_address,
        o.status,
        o.total_amount,
        o.payment_method,
        o.is_paid,
        o.order_time
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      ORDER BY o.order_time DESC
    `);

    // Lấy các món cho tất cả đơn hàng từ order_items và menu_items
    const [items] = await db.execute(`
      SELECT 
        oi.order_id,
        oi.menu_item_id,
        m.name AS menu_item_name,
        m.price,
        oi.quantity
      FROM order_items oi
      JOIN menu_items m ON oi.menu_item_id = m.id
    `);

    // Gắn items vào từng order
    const ordersWithItems = orders.map((order) => ({
      ...order,
      items: items
        .filter((item) => item.order_id === order.order_id)
        .map((item) => ({
          id: item.menu_item_id,
          name: item.menu_item_name,
          price: item.price,
          quantity: item.quantity,
        })),
    }));

    res.json({ orders: ordersWithItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Không thể lấy danh sách đơn hàng",
      error: err.message,
    });
  }
};
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
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
      [status, id]
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

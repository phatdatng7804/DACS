const db = require("../Models/Db");

exports.getStatisticsOfMonth = async (req, res) => {
  try {
    // Lấy món bán chạy nhất
    const [bestSellerRows] = await db.execute(
      `SELECT 
         oi.menu_item_id,
         m.name AS menu_name,
         SUM(oi.quantity) AS quantity_sold,
         SUM(oi.quantity * m.price) AS total_revenue
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN menu_items m ON oi.menu_item_id = m.id
       WHERE MONTH(o.order_time) = MONTH(CURRENT_DATE())
         AND YEAR(o.order_time) = YEAR(CURRENT_DATE())
         AND o.status != 'cancelled'
       GROUP BY oi.menu_item_id
       ORDER BY quantity_sold DESC
       LIMIT 1`
    );

    // Lấy tổng doanh thu và tổng đơn hàng trong tháng
    const [summaryRows] = await db.execute(
      `SELECT 
         COUNT(DISTINCT o.id) AS total_orders,
         SUM(o.total_amount) AS total_revenue
       FROM orders o
       WHERE MONTH(o.order_time) = MONTH(CURRENT_DATE())
         AND YEAR(o.order_time) = YEAR(CURRENT_DATE())
         AND o.status != 'cancelled'`
    );

    const bestSeller = bestSellerRows.length > 0 ? bestSellerRows[0] : null;
    const summary =
      summaryRows.length > 0
        ? summaryRows[0]
        : { total_orders: 0, total_revenue: 0 };

    res.json({
      best_seller: bestSeller,
      total_orders: summary.total_orders || 0,
      total_revenue: summary.total_revenue || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Lỗi khi thống kê dữ liệu tháng",
      error: err.message,
    });
  }
};

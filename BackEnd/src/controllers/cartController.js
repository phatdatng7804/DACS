const db = require("../Models/Db");
const { verifyToken } = require("../middleware/auth");
exports.addToCart = async (req, res) => {
  const { customer_id, menu_item_id, quantity } = req.body;

  try {
    const [existing] = await db.execute(
      "SELECT * FROM cart_items WHERE customer_id = ? AND menu_item_id = ?",
      [customer_id, menu_item_id]
    );

    if (existing.length > 0) {
      await db.execute(
        "UPDATE cart_items SET quantity = quantity + ? WHERE customer_id = ? AND menu_item_id = ?",
        [quantity, customer_id, menu_item_id]
      );
    } else {
      await db.execute(
        "INSERT INTO cart_items (customer_id, menu_item_id, quantity) VALUES (?, ?, ?)",
        [customer_id, menu_item_id, quantity]
      );
    }

    res.json({ message: "Đã thêm vào giỏ hàng" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi thêm vào giỏ hàng", error: err.message });
  }
};

exports.getCart = async (req, res) => {
  const { customer_id } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT ci.id, ci.quantity, m.name, m.price, m.image_url 
       FROM cart_items ci 
       JOIN menu_items m ON ci.menu_item_id = m.id 
       WHERE ci.customer_id = ?`,
      [customer_id]
    );

    const total = rows.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.json({ items: rows, total });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy giỏ hàng", error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!["increment", "decrement"].includes(action)) {
    return res.status(400).json({ message: "Hành động không hợp lệ" });
  }

  try {
    const operator = action === "increment" ? "+" : "-";
    await db.execute(
      `UPDATE cart_items SET quantity = quantity ${operator} 1 WHERE id = ?`,
      [id]
    );
    await db.execute("DELETE FROM cart_items WHERE quantity <= 0");
    res.json({ message: "Cập nhật giỏ hàng thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật giỏ hàng", error: err.message });
  }
};

exports.deleteCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM cart_items WHERE id = ?", [id]);
    res.json({ message: "Đã xoá món khỏi giỏ hàng" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá món", error: err.message });
  }
};

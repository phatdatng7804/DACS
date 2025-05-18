const db = require("../Models/Db");
const { verifyToken } = require("../middleware/auth");

exports.createReport = async (req, res) => {
  const { reported_by, target_type, target_id, reason } = req.body;

  if (!["user", "restaurant", "review"].includes(target_type)) {
    return res.status(400).json({ message: "target_type không hợp lệ" });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO reports (reported_by, target_type, target_id, reason) VALUES (?, ?, ?, ?)",
      [reported_by, target_type, target_id, reason]
    );

    res.json({
      message: "Bạn đã báo cáo thành công!",
      reportId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Không thể báo cáo! ", error: err.message });
  }
};

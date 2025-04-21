require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Các API chính
//app.use("/auth", require("./src/routes/auth"));
app.use("/menu", require("./src/routes/menu"));
app.use("/orders", require("./src/routes/orders"));
app.use("/payment", require("./src/routes/payment"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

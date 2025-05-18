require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
app.use(cors());
app.use(express.json());

// Thêm Swagger UI
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Các API chính
app.use("/auth", require("./src/routes/auth"));
app.use("/menu", require("./src/routes/menu"));
app.use("/orders", require("./src/routes/orders"));
app.use("/payment", require("./src/routes/payment"));
app.use("/category", require("./src/routes/category"));
app.use("/restaurant", require("./src/routes/restaurant"));
app.use("/admin", require("./src/routes/admin"));
app.use("/cart", require("./src/routes/cart"));
app.use("/reports", require("./src/routes/report"));

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log(`Swagger chạy tại http://localhost:${PORT}/api-docs`);
});

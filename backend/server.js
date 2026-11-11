import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import 'dotenv/config';
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// Khởi tạo ứng dụng Express
const app = express()
const port = 4000 

// Middleware
app.use(express.json()) 
app.use(cors()) 

// Kết nối với cơ sở dữ liệu MongoDB
connectDB();

// Khai báo các API endpoints
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/images", express.static('uploads'));

app.get("/", (req, res) => {
    res.send("API Server đang hoạt động tốt!")
})

// Bật server và lắng nghe ở cổng 4000
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`)
})
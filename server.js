import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoutes.js";
import boardRoute from "./routes/boardRoutes.js";
import taskRoute from "./routes/taskRoutes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

const allowedOrigins = ["*"];
app.use(cors({
    // origin:  allowedOrigins, // Allow requests from frontend
    origin: "http://localhost:3000", // Allow requests from frontend
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use(cookieParser());

app.use("/api/auth", authRoute);  
app.use("/api/board", authMiddleware, boardRoute);
app.use("/api/task", authMiddleware, taskRoute);

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Cibanna Backend Project</h1>");
  });

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
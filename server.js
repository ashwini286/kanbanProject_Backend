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

const allowedOrigins = [
    "http://localhost:3000",
    "https://kanban-board-version2.netlify.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);  // Allow request
        } else {
            callback(new Error("Not allowed by CORS"));  // Block request
        }
    },
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
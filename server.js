import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoutes.js";
import boardRoute from "./routes/boardRoutes.js";
import taskRoute from "./routes/taskRoutes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import columnRoute from "./routes/columnRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
});

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://taskpilot-2026.vercel.app"
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
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoute);  
app.use("/api/board", authMiddleware, boardRoute);
app.use("/api/column", authMiddleware, columnRoute);
app.use("/api/task", authMiddleware, taskRoute);

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Cibanna Backend Project</h1>");
});

const port = process.env.PORT || 8000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log(`User connected to websocket: ${socket.id}`);

    socket.on("join-board", (boardId) => {
        socket.join(boardId);
        console.log(`Socket ${socket.id} joined board/room ${boardId}`);
    });

    socket.on("board-changed", (data) => {
        // broadcast changes to all other clients viewing the same board
        socket.to(data.boardId).emit("board-changed", data);
    });

    socket.on("join-workspace", ({ userId }) => {
        socket.join(userId.toString());
        console.log(`Socket ${socket.id} joined workspace room ${userId}`);
    });

    socket.on("workspace-changed", (data) => {
        socket.to(data.userId.toString()).emit("workspace-changed", data);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected from websocket: ${socket.id}`);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
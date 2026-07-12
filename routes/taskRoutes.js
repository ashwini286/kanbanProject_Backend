import express from "express";
import { createTask, getTasks, updateTask, deleteTask, reorderTasks } from "../controllers/taskController.js";
const router = express.Router();

router.post("/", createTask);
router.get("/column/:columnId", getTasks);
router.put("/reorder/bulk", reorderTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
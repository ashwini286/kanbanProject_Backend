import express from "express";
import { createTask, getTasks, updateTask, deleteTask, reorderTasks, addAttachment, deleteAttachment } from "../controllers/taskController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
const router = express.Router();

router.post("/", createTask);
router.get("/column/:columnId", getTasks);
router.put("/reorder/bulk", reorderTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

// Attachment routes
router.post("/:id/attachment", upload.single("file"), addAttachment);
router.delete("/:id/attachment/:attachmentId", deleteAttachment);

export default router;
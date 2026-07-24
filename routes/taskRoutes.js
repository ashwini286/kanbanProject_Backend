import express from "express";
import { createTask, getTasks, updateTask, deleteTask, reorderTasks, addAttachment, deleteAttachment } from "../controllers/taskController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { trimBody, requireFields, maxLength } from "../middlewares/validate.js";
const router = express.Router();

router.post("/", trimBody, requireFields("title", "column", "board"), maxLength("title", 200), createTask);
router.get("/column/:columnId", getTasks);
router.put("/reorder/bulk", authMiddleware, reorderTasks);
router.put("/:id", trimBody, maxLength("title", 200), updateTask);
router.delete("/:id", deleteTask);

// Attachment upload middleware wrapper with clean error handling
const handleUpload = (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            console.error("File upload error:", err.message);
            return res.status(400).json({ message: err.message || "File upload failed" });
        }
        next();
    });
};

// Attachment routes
router.post("/:id/attachment", handleUpload, addAttachment);
router.delete("/:id/attachment/:attachmentId", deleteAttachment);

export default router;
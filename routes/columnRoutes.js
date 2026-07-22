import express from "express";
import { createColumn, updateColumn, deleteColumn, reorderColumns } from "../controllers/columnController.js";
import { trimBody, requireFields, maxLength } from "../middlewares/validate.js";
const router = express.Router();

router.post("/", trimBody, requireFields("boardId", "title"), maxLength("title", 100), createColumn);
router.put("/reorder/bulk", reorderColumns);
router.put("/:id", trimBody, maxLength("title", 100), updateColumn);
router.delete("/:id", deleteColumn);

export default router;

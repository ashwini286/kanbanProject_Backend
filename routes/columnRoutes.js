import express from "express";
import { createColumn, updateColumn, deleteColumn, reorderColumns } from "../controllers/columnController.js";
const router = express.Router();

router.post("/", createColumn);
router.put("/reorder/bulk", reorderColumns);
router.put("/:id", updateColumn);
router.delete("/:id", deleteColumn);

export default router;

import express from "express";
import { createBoard, getBoards, getBoardDetails, updateBoard, deleteBoard, reorderBoards } from "../controllers/boardController.js";
const router = express.Router();

router.post("/", createBoard);
router.get("/", getBoards);
router.put("/reorder", reorderBoards);
router.get("/:id", getBoardDetails);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

export default router;
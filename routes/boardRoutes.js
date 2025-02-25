import express from "express";
import { createBoard, getBoards, deleteBoard } from "../controllers/boardController.js";
const router = express.Router();

router.post("/", createBoard);
router.get("/", getBoards);
router.delete("/:id", deleteBoard);

export default router;
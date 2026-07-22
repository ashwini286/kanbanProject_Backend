import express from "express";
import { createBoard, getBoards, getBoardDetails, updateBoard, deleteBoard, reorderBoards } from "../controllers/boardController.js";
import { trimBody, requireFields, maxLength } from "../middlewares/validate.js";
const router = express.Router();

router.post("/", trimBody, requireFields("title"), maxLength("title", 100), createBoard);
router.get("/", getBoards);
router.put("/reorder", reorderBoards);
router.get("/:id", getBoardDetails);
router.put("/:id", trimBody, maxLength("title", 100), updateBoard);
router.delete("/:id", deleteBoard);

export default router;
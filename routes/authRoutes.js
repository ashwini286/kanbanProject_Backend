import express from "express";
import { login, signup } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", authMiddleware, (req, res) => {
    res.status(200).json({ valid: true, user: req.user });
});

export default router;
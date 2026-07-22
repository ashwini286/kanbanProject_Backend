import express from "express";
import { login, signup, resetPassword } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { trimBody, requireFields, validateEmail } from "../middlewares/validate.js";
const router = express.Router();

// trimBody strips whitespace, validateEmail checks email format, requireFields ensures no empty values
router.post("/signup", trimBody, validateEmail, requireFields("password"), signup);
router.post("/login", trimBody, validateEmail, requireFields("password"), login);
router.post("/reset-password-direct", trimBody, validateEmail, requireFields("newPassword"), resetPassword);
router.get("/verify", authMiddleware, (req, res) => {
    res.status(200).json({ valid: true, user: req.user });
});

export default router;
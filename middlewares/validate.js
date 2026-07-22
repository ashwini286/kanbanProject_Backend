// middlewares/validate.js
// Simple validation middleware - checks inputs before they reach the database

/**
 * Abhi kya tha: Controllers directly call services without checking anything.
 * Ab kya hoga: Ye middleware pehle check karega:
 *   1. Required fields present hain ya nahi
 *   2. String fields empty toh nahi hain
 *   3. String length limit ke andar hai ya nahi
 * Agar koi bhi check fail hoga, 400 Bad Request return hoga with a clear message.
 * Database tak request pahunchegi hi nahi.
 */

// Generic: ensure required string fields are present and non-empty
export const requireFields = (...fields) => (req, res, next) => {
    for (const field of fields) {
        const value = req.body[field];
        if (value === undefined || value === null) {
            return res.status(400).json({ message: `'${field}' is required.` });
        }
        if (typeof value === "string" && value.trim() === "") {
            return res.status(400).json({ message: `'${field}' cannot be empty.` });
        }
    }
    next();
};

// Trim all string fields in req.body to strip leading/trailing whitespace
export const trimBody = (req, res, next) => {
    if (req.body && typeof req.body === "object") {
        for (const key of Object.keys(req.body)) {
            if (typeof req.body[key] === "string") {
                req.body[key] = req.body[key].trim();
            }
        }
    }
    next();
};

// Validate string max length
export const maxLength = (field, max) => (req, res, next) => {
    const value = req.body[field];
    if (value && typeof value === "string" && value.length > max) {
        return res.status(400).json({ message: `'${field}' must be ${max} characters or fewer.` });
    }
    next();
};

// Validate email format
export const validateEmail = (req, res, next) => {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Email is required." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ message: "Invalid email format." });
    }
    next();
};

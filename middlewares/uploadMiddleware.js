import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists in working directory
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});

// Configure upload engine (Max 10MB)
export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Always configure Cloudinary directly with env vars
cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || "").trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim(),
  secure: true
});

console.log("Cloudinary Config Loaded:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
  api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing"
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cibanna_kanban', // Folder in your Cloudinary dashboard
    resource_type: 'auto', // Automatically detect image vs raw file (PDF, ZIP, etc)
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname).toLowerCase();
      const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
      return `${file.fieldname}-${baseName}-${uniqueSuffix}`;
    },
  },
});

// Whitelist of allowed file extensions and MIME types
const ALLOWED_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|mp4|mov|avi|mkv|webm|mp3|wav)$/i;
const ALLOWED_MIMETYPES = [
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain", "text/csv",
    "application/zip", "application/x-rar-compressed",
    "video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm",
    "audio/mpeg", "audio/wav", "audio/mp3", "audio/x-wav"
];

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isExtAllowed = ALLOWED_EXTENSIONS.test(ext);
    const isMimeAllowed = ALLOWED_MIMETYPES.includes(file.mimetype);

    if (isExtAllowed && isMimeAllowed) {
        cb(null, true); // Accept file
    } else {
        cb(new Error(`File type not allowed. Allowed types: Images, Videos, Audio, PDF, Word, Excel, PowerPoint, Text, CSV, ZIP`), false);
    }
};

// Configure upload engine (Max 10MB, whitelisted types only)
export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter
});

import path from "path";
import fs from "fs";
import multer from "multer";
import { Request } from "express";

const uploadsDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${unique}${ext}`);
  },
});

const imageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const documentMimeTypes = [
  ...imageMimeTypes,
  "application/pdf",
];

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.fieldname === "photo") {
    if (imageMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Photo must be an image (JPEG, PNG, WebP, or GIF)"));
    }
    return;
  }

  if (file.fieldname === "document") {
    if (documentMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Document must be an image or PDF"));
    }
    return;
  }

  cb(new Error("Unexpected file field"));
};

export const uploadApplicationFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).fields([
  { name: "photo", maxCount: 1 },
  { name: "document", maxCount: 1 },
]);

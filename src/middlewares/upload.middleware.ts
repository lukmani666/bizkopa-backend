import multer from "multer";

export const uploadMiddleware = multer({
  dest: 'tmp/',
  limits: { fileSize: 5 * 1024 * 1024} // 5MB
})
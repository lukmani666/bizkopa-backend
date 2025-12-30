import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { uploadMiddleware } from '../../middlewares/upload.middleware';
import { UploadController } from './upload.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/uploads/avatar:
 *   post:
 *     summary: Upload user avatar
 *     description: |
 *       Uploads a profile avatar for the authenticated user.
 *       This endpoint accepts a multipart/form-data request with a single file field named **file**.
 *       The uploaded file is stored using the configured storage provider (Wasabi in production, local/cloud test storage in development).
 *     tags:
 *       - Uploads
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload as avatar (jpg, png, jpeg).
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Avatar uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatarUrl:
 *                       type: string
 *                       example: https://cdn.bizkopa.com/avatars/user_123.png
 *       400:
 *         description: Invalid file or upload error
 *       401:
 *         description: Unauthorized – missing or invalid JWT token
 */
router.post(
  '/avater',
  authMiddleware,
  uploadMiddleware.single('file'),
  UploadController.uploadAvatar
)

export default router;
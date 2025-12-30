import { Request, Response } from 'express';
import { StorageService } from '../../services/storage.service';

export class UploadController {
  static async uploadAvatar(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({
        message: 'File is required'
      });
    }

    const key = `avatars/${Date.now()}-${req.file.originalname}`;
    const url = await StorageService.upload(req.file.path, key);

    return res.status(201).json({
      success: true,
      url
    });
  }
}
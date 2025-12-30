import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../modules/users/user.model';
import { AppError } from '../utils/app-error';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Authorization token missing', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);

    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) throw new AppError('User not found', 404);

    (req as any).user = user;
    next();
  } catch (error: any) {
    return res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || 'Unauthorized'
    });
  }
};

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../modules/users/user.model'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error("Authorization detail not provided");

    const decode: any = verifyToken(token);
    const user = await User.findById(decode.userId);
    if (!user) throw new Error("User not found");

    (req as any).user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ success: false, message: "Authorization detail not provided"})
  }
}
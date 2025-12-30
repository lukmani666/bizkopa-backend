import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // known application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  //Unknown / unexpected errors
  console.error("Unhandle Error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
import { Request, Response, NextFunction } from "express";
import Business from '../modules/businesses/business.model';

export class BusinessOwnerMiddleware {

  static async requireBusinessOwner(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = (req as any).user;
    const { businessId } = req.params;
  
    const business = await Business.findOne({
      _id: businessId,
      owner: user._id
    });
  
    if (!business) {
      return res.status(403).json({
        success: false,
        message: 'Only business owner can perform this action'
      });
    }
  
    next();
  }

  static async requireBusinessAccess(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = (req as any).user;
    const { businessId } = req.params;

    const business = await Business.findOne({
      _id: businessId,
      $or: [
        { owner: user._id },
        { 'staff.user': user._id}
      ]
    });

    if (!business) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this business'
      });
    }

    (req as any).business = business;
    next();
  }
}
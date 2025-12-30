import { Request, Response, NextFunction } from "express";
import BusinessStaff from '../modules/business-staff/business-staff.model';
import { BusinessPermission } from "../modules/business-staff/permissions";

export const requireBusinessPermission = 
  (permission: BusinessPermission) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const businessId = req.params.businessId;

      const staff = await BusinessStaff.findOne({
        business: businessId,
        user: user._id,
        isActive: true
      });

      if (!staff || !staff.permissions.includes(permission)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      (req as any).businessStaff = staff;
      next();
    } catch {
      return res.status(403).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
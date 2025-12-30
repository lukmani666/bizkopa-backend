import { Request, Response } from "express";
import mongoose from "mongoose";
import { BusinessStaffService } from "./business-staff.service";
import BusinessStaff from './business-staff.model';
import { BusinessService } from "../businesses/business.service";
import { BusinessRole } from "./permissions";

export class BusinessStaffController {
  static async addStaff(req: Request, res: Response) {
    const { userId, role } = req.body;
    const { businessId } = req.params;

    const staff = await BusinessStaffService.addStaff(
      businessId as any,
      userId,
      role
    );

    return res.status(201).json({
      success: true,
      data: staff
    });
  }

  static async listStaff(req: Request, res: Response) {
    const { businessId } = req.params;

    const staff = await BusinessStaffService.listStaff(businessId as any);

    return res.status(200).json({
      success: true,
      data: staff
    });
  }

  static async getStaffById(req: Request, res: Response) {
    try {
      const { businessId, staffId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(businessId) ||
        !mongoose.Types.ObjectId.isValid(staffId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format"
        });
      }

      const staff = await BusinessStaff.findOne({ 
        _id: staffId, 
        business: businessId,
        isActive: true 
      })
        .populate("user", "email role")
        .populate("business", "name industry")

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff not found for this business"
        });
      }

      return res.status(200).json({
        success: true,
        data: staff
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch staff"
      });
    }
  }

  static async updateStaff(req: Request, res: Response) {
    try {
      const { businessId, staffId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(businessId) ||
        !mongoose.Types.ObjectId.isValid(staffId)
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid ID format'
        });
      }

      const staff = await BusinessStaffService.updateStaff(
        businessId,
        staffId,
        req.body
      );

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: 'Staff not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: staff
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update staff'
      });
    }
  }

  static async removeStaff(req: Request, res: Response) {
    try {
      const { businessId, staffId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(businessId) ||
        !mongoose.Types.ObjectId.isValid(staffId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format"
        });
      }

      const removed = await BusinessStaffService.removeStaff(
        businessId,
        staffId,
      );

      if (!removed) {
        return res.status(404).json({
          success: false,
          message: 'Staff not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: "Staff removed successfully"
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to remove staff"
      });
    }
  }

  static async acceptInvite(req: Request, res: Response) {
    const { token } = req.body;
    const user = (req as any).user;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Invite token is required'
      });
    }

    const staff = await BusinessStaffService.acceptInvite(
      token,
      user._id
    );

    return res.status(200).json({
      success: true,
      message: 'Invite accepted successfully',
      data: staff
    });
  }

  static async inviteStaff(req: Request, res: Response) {
    const { email, role } = req.body;
    const { businessId } = req.params;

    if (!email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email and role are required'
      });
    }

    if (!Object.values(BusinessRole).includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const invite = await BusinessStaffService.inviteStaff(
      businessId as any,
      email,
      role
    );

    return res.status(201).json({
      success: true,
      message: 'Staff invite sent successfully',
      data: invite
    });
  }
}
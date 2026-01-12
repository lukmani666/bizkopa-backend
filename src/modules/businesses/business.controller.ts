import { Request, Response } from 'express';
import { BusinessService } from './business.service';
import Business from './business.model'
import BusinessStaff from '../business-staff/business-staff.model';
import mongoose from 'mongoose';

export class BusinessController {
  static async createBusiness(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      const business = await BusinessService.createBusiness(
        user._id, req.body
      );

      return res.status(201).json({
        success: true,
        data: business
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create business'
      })
    }
  }

  // static async getMyBusiness(req: Request, res: Response) {
  //   try {
  //     const user = (req as any).user;

  //     const businesses = await BusinessService.getUserBusiness(
  //       user._id
  //     )
  //     return res.status(200).json({
  //       success: true,
  //       data: businesses
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       success: false,
  //       message: "Failed to fetch bussinesses"
  //     });
  //   }
  // }

  static async getMyBusiness(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      const staffRecords = await BusinessStaff.find({
        user: user._id,
        isActive: true
      })
      .populate("business");

      const businesses = staffRecords.map((staff) => {
        const biz: any = staff.business;

        return {
          _id: biz._id,
          owner: biz.owner,
          name: biz.name,
          industry: biz.industry,
          phoneNumber: biz.phoneNumber,
          email: biz.email,
          address: biz.address,
          isActive: biz.isActive,

          // IMPORTANT – role comes from BusinessStaff
          role: staff.role,
          permissions: staff.permissions,
          createdAt: biz.createdAt
        };
      });

      return res.status(200).json({
        success: true,
        data: businesses
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch businesses"
      });
    }
  }

  // static async getBusinessById(req: Request, res: Response) {
  //   try {
  //     const { businessId } = req.params;

  //     if (!mongoose.Types.ObjectId.isValid(businessId)) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Invalid business ID"
  //       });
  //     }

  //     const business = await Business.findById(businessId)
  //       .populate('owner', 'email')
  //       .populate('staff.user', 'email role');
      
  //     if (!business) {
  //       return res.status(404).json({
  //         success: false,
  //         message: 'Business not found'
  //       });
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       data: business
  //     });
      
  //   } catch (error) {
  //     return res.status(500).json({
  //       success: false,
  //       message: "Failed to fetch business"
  //     });
  //   }
  // }

  static async getBusinessById(req: Request, res: Response) {
    try {
      const { businessId } = req.params;
      const user = (req as any).user;

      if (!mongoose.Types.ObjectId.isValid(businessId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid business ID"
        });
      }

      const business = await Business.findById(businessId)
        .populate('owner', 'email');

      if (!business) {
        return res.status(404).json({
          success: false,
          message: 'Business not found'
        });
      }

      // Fetch staff for this business
      const staff = await BusinessStaff.find({
        business: business._id,
        isActive: true
      })
      .populate('user', 'email role');

      // Determine current user role
      const myStaff = staff.find(
        (s) => String(s.user._id) === String(user._id)
      );

      return res.status(200).json({
        success: true,
        data: {
          ...business.toObject(),
          staff,
          myRole: myStaff?.role || null
        }
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch business"
      });
    }
  }


  static async updateBusiness(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { businessId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(businessId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid business ID"
        });
      } 

      const updateBusiness = await BusinessService.updateBusiness(
        businessId,
        user._id,
        req.body
      );

      if (!updateBusiness) {
        return res.status(404).json({
          success: false,
          message: 'Bussiness not found or unauthorized'
        });
      }

      return res.status(200).json({
        success: true,
        data: updateBusiness
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update business'
      });
    }
  }

  static async deleteBusiness(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { businessId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(businessId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid business ID"
        });
      } 

      const deleteBusiness = await BusinessService.deleteBusiness(
        businessId,
        user._id
      );

      if (!deleteBusiness) {
        return res.status(404).json({
          success: false,
          message: 'Bussiness not found or unauthorized'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Business deleted successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete business'
      });
    }
  }
}
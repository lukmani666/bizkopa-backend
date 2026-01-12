import Business, { IBusiness } from './business.model';
import BusinessStaff from '../business-staff/business-staff.model';
import { RolePermission, BusinessRole } from '../business-staff/permissions';
import { Types } from 'mongoose';

export class BusinessService {
  static async createBusiness(ownerId: Types.ObjectId, payload: any): Promise<IBusiness> {
    const business = new Business({
      owner: ownerId,
      ...payload
    });

    await business.save();

    await BusinessStaff.create({
      business: business._id,
      user: ownerId,
      role: BusinessRole.OWNER,
      permissions: RolePermission[BusinessRole.OWNER]
    });
    return business;
  }

  // static async getUserBusiness(ownerId: Types.ObjectId) {
  //   return Business.find({ owner: ownerId}).sort({ createdAt: -1});
  // }

  static async getUserBusiness(userId: Types.ObjectId) {

    // Get all staff records for this user
    const staffRecords = await BusinessStaff.find({
      user: userId,
      isActive: true
    });

    const businessIds = staffRecords.map((s) => s.business);

    // Fetch businesses the user belongs to
    const businesses = await Business.find({
      _id: { $in: businessIds },
      isActive: true
    })
    .populate('owner', 'email')
    .sort({ createdAt: -1 });

    // Attach role from staff records
    return businesses.map((biz) => {
      const staff = staffRecords.find(
        (s) => String(s.business) === String(biz._id)
      );

      return {
        ...biz.toObject(),
        role: staff?.role || null
      };
    });
  }


  static async updateBusiness(
    businessId: string,
    ownerId: Types.ObjectId,
    payload: any
  ) {
    return Business.findOneAndUpdate(
      {_id: businessId, owner: ownerId},
      payload,
      { new: true }
    );
  }

  static async deleteBusiness(
    businessId: string,
    ownerId: Types.ObjectId
  ) {
    // return Business.findOneAndDelete({
    //   _id: businessId,
    //   owner: ownerId
    // });
    const deleted = await Business.findOneAndDelete({
      _id: businessId,
      owner: ownerId
    });

    if (deleted) {
      await BusinessStaff.deleteMany({
        business: businessId
      })
    }

    return deleted;
  }
}
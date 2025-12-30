import BusinessStaff from './business-staff.model';
import { RolePermission, BusinessRole } from './permissions';
import { Types } from 'mongoose';
import Business from '../businesses/business.model';
import BusinessInvite from './business-invite.model'
import crypto from 'crypto';
import { AppError } from '../../utils/app-error';
import { notificationQueue } from '../../queues';
import { StaffInviteJob } from '../../queues/types';

export class BusinessStaffService {
  static async addStaff(
    businessId: Types.ObjectId,
    userId: Types.ObjectId,
    role: BusinessRole
  ) {
    return BusinessStaff.create({
      business: businessId,
      user: userId,
      role,
      permissions: RolePermission[role]
    });
  }

  static async listStaff(businessId: Types.ObjectId) {
    return BusinessStaff.find({ business: businessId })
      .populate('user', 'phoneNumber role')
      .sort({ createdAt: -1 });
  }

  static async updateStaff(
    businessId: string,
    staffId: string,
    payload: any
  ) {
    return Business.findOneAndUpdate(
      {
        _id: businessId,
        'staff._id': staffId
      },
      {
        $set: {
          'staff.$': {
            ...payload,
            _id: staffId
          }
        }
      },
      { new: true }
    );
  }

  static async removeStaff(
    businessId: string,
    staffId: string
  ) {
    return Business.findOneAndUpdate(
      { _id: businessId },
      { $pull: { staff: { _id: staffId } } },
      { new: true }
    );
  }

  static async inviteStaff(
    businessId: Types.ObjectId,
    email: string,
    role: BusinessRole
  ) {
    const business = await Business.findById(businessId);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    const token = crypto.randomBytes(32).toString('hex');

    const invite = await BusinessInvite.create({
      business: businessId,
      email,
      role,
      permission: RolePermission[role],
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 *24 * 7) // 7 days
    });

    const inviteLink = `${process.env.FRONTEND_URL}/invite/accept?token=${token}`;

    await notificationQueue.add('staff-invite', {
      email,
      businessName: business.name,
      inviteLink
    } satisfies StaffInviteJob);

    console.log(`[QUEUE] Staff invite job added for ${email}`);

    // 🔔 queue email / WhatsApp here

    return invite;
  }

  static async acceptInvite(token: string, userId: Types.ObjectId) {
    const invite = await BusinessInvite.findOne({
      token,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (!invite) throw new AppError('Invalid or expired invite', 400);

    const existingStaff = await BusinessStaff.findOne({
      business: invite.business,
      user: userId
    });

    if (existingStaff) {
      throw new AppError('User already belongs to this business', 409)
    }

    const staff = await BusinessStaff.create({
      business: invite.business,
      user: userId,
      role: invite.role,
      permissions: invite.permission
    });

    invite.status = 'accepted';
    await invite.save();

    return staff;
  }
}
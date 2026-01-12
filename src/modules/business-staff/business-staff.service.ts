import BusinessStaff from './business-staff.model';
import { RolePermission, BusinessRole } from './permissions';
import { Types } from 'mongoose';
import Business from '../businesses/business.model';
import BusinessInvite from './business-invite.model'
import crypto from 'crypto';
import { AppError } from '../../utils/app-error';
import { notificationQueue } from '../../queues';
import { StaffInviteJob } from '../../queues/types';
import { email } from 'zod';

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
    return BusinessStaff.find({ business: businessId, isActive: true })
      .populate({
        path: 'user', 
        select: 'first_name last_name role email'
      })
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
      inviteLink,
      role,
      expiresAt: invite.expiresAt.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Africa/Lagos'
      })
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

  static async getInvites(
    businessId: Types.ObjectId,
    status?: string
  ) {
    return BusinessInvite.find({
      business: businessId,
      ...(status && { status }),
    }).sort({ createdAt: -1 });
  }

  static async resendInvite(
    businessId: Types.ObjectId,
    invitedId: Types.ObjectId
  ) {
    const invite = await BusinessInvite.findOne({
      _id: invitedId,
      business: businessId,
      status: 'pending',
    }).populate('business');

    if (!invite) {
      throw new AppError('Invite not found', 404);
    }

    const inviteLink = `${process.env.FRONTEND_URL}/invite/accept?token=${invite.token}`;

    await notificationQueue.add('staff-invite', {
      email: invite.email,
      businessName: (invite.business as any).name,
      inviteLink,
      role: invite.role,
      expiresAt: invite.expiresAt.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Africa/Lagos',
      }),
    });
  }

  static async cancelInvite(
    businessId: Types.ObjectId,
    inviteId: Types.ObjectId
  ) {
    const invite = await BusinessInvite.findOneAndUpdate(
      {
        _id: inviteId,
        business: businessId,
        status: 'pending',
      },
      { status: 'expired' },
      { new: true }
    );

    if (!invite) {
      throw new AppError('Invite not found', 404);
    }

    return invite;
  }

  static async validateInvite(token: string) {
    const invite = await BusinessInvite
      .findOne({ token })
      .populate('business', 'name');
    
    if (!invite) {
      throw new AppError('Invite not found', 404);
    }

    if (invite.status === 'accepted') {
      return { status: 'accepted' };
    }

    if (invite.status !== 'pending') {
      return { status: 'expired' };
    }

    if (invite.expiresAt < new Date()) {
      return { status: 'expired' };
    }

    return {
      status: 'pending',
      email: invite.email,
      role: invite.role,
      businessName: (invite.business as any).name,
      expiresAt: invite.expiresAt
    };
  }
}
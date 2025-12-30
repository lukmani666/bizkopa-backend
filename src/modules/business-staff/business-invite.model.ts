import { Schema, model, Document, Types } from 'mongoose';
import { BusinessRole, BusinessPermission } from './permissions';

export interface IBusinessInvite extends Document {
  business: Types.ObjectId;
  email: string;
  role: BusinessRole;
  permission: BusinessPermission[];
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessInviteSchema = new Schema<IBusinessInvite>(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    role: {
      type: String,
      enum: Object.values(BusinessRole),
      required: true
    },
    permission: {
      type: [String],
      required: true
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired'],
      default: 'pending'
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      transform(_doc, ret: any) {
        delete ret.__v;
        return ret;
      }
    } 
  }
);

BusinessInviteSchema.index(
  { business: 1, email: 1 },
  { unique: true }
);

export default model<IBusinessInvite>(
  "BusinessInvite",
  BusinessInviteSchema
)
import { Schema, model, Document, Types } from 'mongoose';
import { BusinessRole, BusinessPermission } from './permissions';

export interface IBusinessStaff extends Document {
  business: Types.ObjectId;
  user: Types.ObjectId;
  role: BusinessRole;
  permissions: BusinessPermission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessStaffSchema = new Schema<IBusinessStaff>(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    role: {
      type: String,
      enum: Object.values(BusinessRole),
      required: true
    },
    permissions: {
      type: [String],
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
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

BusinessStaffSchema.index({ business: 1, user: 1}, { unique: true});

export default model<IBusinessStaff>(
  'BusinessStaff',
  BusinessStaffSchema
);
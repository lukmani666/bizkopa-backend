import { Schema, model, Document, Types } from 'mongoose';

export interface IBusiness extends Document {
  owner: Types.ObjectId;
  name: string;
  industry: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new Schema<IBusiness>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    industry: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    address: {
      type: String
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

export default model<IBusiness>('Business', BusinessSchema);
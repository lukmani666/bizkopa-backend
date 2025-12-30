import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  passwordHash: string;
  role: 'owner' | 'staff';
  isActive: boolean;
  comparePassword: (password: string) => Promise<boolean>
}

const UserSchema: Schema<IUser> = new Schema(
  {
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['owner', 'staff'], default: 'owner'},
    isActive: { type: Boolean, default: true}
  },
  { 
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      transform(_doc, ret: any) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      }
    }
  }
);

//password compare method
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
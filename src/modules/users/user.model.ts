import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: 'owner' | 'staff';
  isActive: boolean;
  comparePassword: (password: string) => Promise<boolean>
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true},
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['owner', 'staff'], default: 'owner'},
    isActive: { type: Boolean, default: true}
  },
  { timestamps: true }
);

//password compare method
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
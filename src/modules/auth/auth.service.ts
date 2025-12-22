import User, { IUser } from '../users/user.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt';

export class AuthService {
  static async register(email: string, password: string, role: 'owner' | 'staff' = 'owner') {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already registered");

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, passwordHash, role});
    const token = generateToken(user._id.toString());

    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isValids = await user.comparePassword(password);
    if (!isValids) throw new Error('Invalid password');

    const token = generateToken(user._id.toString());
    return { user, token };
  }
}
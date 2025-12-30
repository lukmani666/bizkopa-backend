import User, { IUser } from '../users/user.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt';
import { AppError } from '../../utils/app-error';

export class AuthService {
  static async register(
    first_name: string,
    last_name: string,
    email: string, 
    password: string, 
    role: 'owner' | 'staff' = 'owner'
  ) {
    const existingUser = await User.findOne({ email }).select("+passwordHash");
    if (existingUser) throw new AppError("Email already registered", 409);

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ first_name, last_name, email, passwordHash, role});
    const token = generateToken(user._id.toString());

    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) throw new AppError('User not found', 404);

    const isValids = await user.comparePassword(password);
    if (!isValids) throw new AppError('Invalid password', 400);

    const token = generateToken(user._id.toString());
    return { user, token };
  }
}
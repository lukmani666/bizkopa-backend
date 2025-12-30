import { IUser } from './user.model';
export class UserService {
  static async getProfile(user: IUser) {
    return user;
  }
}

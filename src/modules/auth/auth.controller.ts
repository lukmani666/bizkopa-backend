import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { UserService } from "../users/user.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { first_name, last_name, email, password, role } = req.body;
      const result = await AuthService.register(first_name, last_name, email, password, role);
      return res.status(201).json({ success: true, data: result})
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message});
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

   static async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const profile = await UserService.getProfile(req.user);

      return res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile'
      });
    }
  }
}
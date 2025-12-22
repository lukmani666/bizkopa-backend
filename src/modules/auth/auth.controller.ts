import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
      const result = await AuthService.register(email, password, role);
      return res.status(201).json({ success: true, data: result})
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.massage});
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
}
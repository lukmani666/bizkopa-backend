import { Request, Response } from "express";
import { CookieOptions } from "express";
import { AuthService } from "./auth.service";
import { UserService } from "../users/user.service";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 15 * 60 * 1000,
};
export class AuthController {


  static async register(req: Request, res: Response) {
    try {
      const { first_name, last_name, email, password, role } = req.body;

      const { user, token } = await AuthService.register(
        first_name,
        last_name,
        email,
        password,
        role
      );

      res.cookie("access_token", token, cookieOptions);

      return res.status(201).json({
        success: true,
        data: { user },
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }


  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const { user, token } = await AuthService.login(email, password);

      res.cookie("access_token", token, cookieOptions);

      return res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  } 

  static async logout(req: Request, res: Response) {
    res.clearCookie("access_token", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out",
    });
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
import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: User first name
 *                 example: John
 *               last_name:
 *                 type: string
 *                 description: User last name
 *                 example: Doe
 *               email:
 *                 type: string
 *                 description: User email address
 *                 example: owner@bizkopa.com
 *               password:
 *                 type: string
 *                 description: User password (will be hashed)
 *                 example: StrongPassword123
 *               role:
 *                 type: string
 *                 enum: [owner, staff]
 *                 description: User role
 *                 example: owner
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     first_name:
 *                      type: string
 *                      example: John
 *                     last_name:
 *                      type: string
 *                      example: Doe
 *                     email:
 *                       type: string
 *                       example: owner@bizkopa.com
 *                     role:
 *                       type: string
 *                       example: owner
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-01-20T14:32:10.123Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-01-20T14:32:10.123Z
 *       400:
 *         description: Registration error
 */
router.post("/register", AuthController.register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: owner@bizkopa.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         first_name:
 *                           type: string
 *                           example: John
 *                         last_name:
 *                           type: string
 *                           example: Doe
 *                         email:
 *                           type: string
 *                           example: owner@bizkopa.com
 *                         role:
 *                           type: string
 *                           example: owner
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-01-20T14:32:10.123Z
 *                         updatedAt:
 *                            type: string
 *                            format: date-time
 *                            example: 2025-01-20T14:32:10.123Z
 */
router.post("/login", AuthController.login);


/**
 * @swagger
 * /api/v1/auth/user-profile:
 *   get:
 *     summary: Get authenticated user profile
 *     description: Returns the profile of the currently authenticated user using the JWT token.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 65fa9a7a9d3a1c0012abc123
 *                     first_name:
 *                       type: string
 *                       example: John
 *                     last_name:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: owner@bizkopa.com
 *                     role:
 *                       type: string
 *                       example: owner
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized – invalid or missing token
 */
router.get("/user-profile", authMiddleware, AuthController.getProfile);

export default router;


import { Router } from "express";
import { BusinessController } from "./business.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { BusinessOwnerMiddleware } from "../../middlewares/business.middleware";

const router = Router();
/**
 * @swagger
 * /api/v1/business:
 *   post:
 *     summary: Create a new business
 *     description: Create a business owned by the authenticated user.
 *     tags:
 *       - Business
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - industry
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bizkopa Retail Store
 *               industry:
 *                 type: string
 *                 example: Retail
 *               phoneNumber:
 *                 type: string
 *                 example: "08012345678"
 *               email:
 *                 type: string
 *                 example: store@bizkopa.com
 *               address:
 *                 type: string
 *                 example: Ikeja, Lagos
 *     responses:
 *       201:
 *         description: Business created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, BusinessController.createBusiness);

/**
 * @swagger
 * /api/v1/business:
 *   get:
 *     summary: Get my businesses
 *     description: Returns all businesses owned by the authenticated user.
 *     tags:
 *       - Business
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of businesses
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, BusinessController.getMyBusiness);

/**
 * @swagger
 * /api/v1/business/{businessId}:
 *   put:
 *     summary: Update a business
 *     description: Update a business owned by the authenticated user.
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - industry
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bizkopa Retail Store
 *               industry:
 *                 type: string
 *                 example: Retail
 *               phoneNumber:
 *                 type: string
 *                 example: "08012345678"
 *               email:
 *                 type: string
 *                 example: store@bizkopa.com
 *               address:
 *                 type: string
 *                 example: Ikeja, Lagos
 *     responses:
 *       200:
 *         description: Business updated successfully
 *       404:
 *         description: Business not found or unauthorized
 */
router.put('/:businessId', authMiddleware, BusinessController.updateBusiness);

/**
 * @swagger
 * /api/v1/business/{businessId}:
 *   delete:
 *     summary: Delete a business
 *     description: Delete a business owned by the authenticated user.
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business deleted successfully
 *       404:
 *         description: Business not found or unauthorized
 */
router.delete('/:businessId', authMiddleware, BusinessController.deleteBusiness);


/**
 * @swagger
 * /api/v1/businesses/{businessId}:
 *   get:
 *     summary: Get a single business by ID
 *     description: Retrieve a business owned by the authenticated user.
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *     responses:
 *       200:
 *         description: Business retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Business"
 *       400:
 *         description: Invalid business ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – owner access only
 *       404:
 *         description: Business not found
 */
router.get(
  '/:businessId',
  authMiddleware,
  BusinessOwnerMiddleware.requireBusinessOwner,
  BusinessController.getBusinessById
);



export default router;


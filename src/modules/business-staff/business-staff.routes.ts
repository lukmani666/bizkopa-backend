import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireBusinessPermission } from "../../middlewares/business-permission.middleware";
import { BusinessOwnerMiddleware } from "../../middlewares/business.middleware";
import { BusinessPermission } from "./permissions";
import { BusinessStaffController } from "./business-staff.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/business-staff/{businessId}/staff:
 *   post:
 *     summary: Invite a staff member to a business
 *     description: |
 *       Invite a user to join a business with a specific role.
 *       Permissions are automatically assigned based on the selected role.
 *       Requires **STAFF_INVITE** permission.
 *     tags:
 *       - Business Staff
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - role
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID of the staff to invite
 *                 example: 65fa9a7a9d3a1c0012abc123
 *               role:
 *                 type: string
 *                 description: Role assigned to the staff
 *                 enum:
 *                   - owner
 *                   - manager
 *                   - staff
 *     responses:
 *       201:
 *         description: Staff invited successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BusinessStaff"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       409:
 *         description: Staff already exists in business
 */

router.post(
  '/:businessId/staff',
  authMiddleware,
  requireBusinessPermission(BusinessPermission.STAFF_INVITE),
  BusinessStaffController.addStaff
);

/**
 * @swagger
 * /api/v1/business-staff/{businessId}/staff:
 *   get:
 *     summary: List business staff
 *     description: Retrieve all staff members for a business. Requires STAFF_READ permission.
 *     tags:
 *       - Business Staff
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
 *         description: Staff list retrieved successfully
 *       403:
 *         description: Permission denied
 */
router.get(
  '/:businessId/staff',
  authMiddleware,
  requireBusinessPermission(BusinessPermission.STAFF_READ),
  BusinessStaffController.listStaff
);

/**
 * @swagger
 * /api/v1/business-staff/{businessId}/staff/{staffId}:
 *   patch:
 *     summary: Update a business staff member
 *     description: |
 *       Update role, permissions, or activation status of a staff member.
 *       Requires **STAFF_UPDATE** permission.
 *     tags:
 *       - Business Staff
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *       - in: path
 *         name: staffId
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: Updated staff role
 *                 enum:
 *                   - owner
 *                   - manager
 *                   - staff
 *               permissions:
 *                 type: array
 *                 description: Custom permissions (optional)
 *                 items:
 *                   type: string
 *                   enum:
 *                     - business:read
 *                     - business:update
 *                     - business:delete
 *                     - staff:read
 *                     - staff:invite
 *                     - staff:update
 *                     - staff:remove
 *               isActive:
 *                 type: boolean
 *                 description: Activate or deactivate staff
 *                 example: true
 *     responses:
 *       200:
 *         description: Staff updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BusinessStaff"
 *       400:
 *         description: Invalid update data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Staff not found
 */
router.patch(
  '/:businessId/staff/:staffId',
  authMiddleware,
  BusinessOwnerMiddleware.requireBusinessOwner,
  BusinessStaffController.updateStaff
);


/**
 * @swagger
 * /api/v1/business-staff/{businessId}/staff/{staffId}:
 *   delete:
 *     summary: Remove a staff member from a business
 *     description: Permanently removes a staff member from the business. Owner access only.
 *     tags: [Business Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: staffId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Staff removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Staff removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – owner access only
 *       404:
 *         description: Staff not found
 */
router.delete(
  '/:businessId/staff/:staffId',
  authMiddleware,
  BusinessOwnerMiddleware.requireBusinessOwner,
  BusinessStaffController.removeStaff
);

/**
 * @swagger
 * /api/v1/business-staff/{businessId}/staff/{staffId}:
 *   get:
 *     summary: Get a single staff member by ID
 *     description: Retrieve a specific staff member belonging to a business. Owner access only.
 *     tags: [Business Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *       - in: path
 *         name: staffId
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *     responses:
 *       200:
 *         description: Staff retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BusinessStaff"
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – owner access only
 *       404:
 *         description: Staff not found
 */
router.get(
  '/:businessId/staff/:staffId',
  authMiddleware,
  BusinessOwnerMiddleware.requireBusinessOwner,
  BusinessStaffController.getStaffById
)

/**
 * @swagger
 * /api/v1/business-staff/accept:
 *   post:
 *     summary: Accept a business staff invitation
 *     description: Allows an authenticated user to accept a pending business invitation using an invite token.
 *     tags:
 *       - Business Staff
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "c2b4f8a9e2f74e4bb0a7c6b1d9a8e1a2"
 *     responses:
 *       200:
 *         description: Invite accepted successfully
 *       400:
 *         description: Invalid or expired invite
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: User already belongs to the business
 */

router.post(
  '/accept',
  authMiddleware,
  BusinessStaffController.acceptInvite
);


/**
 * @swagger
 * /api/v1/business-staff/{businessId}/invite:
 *   post:
 *     summary: Invite a staff member to a business
 *     description: Sends an invitation to a staff member via email to join a business.
 *     tags:
 *       - Business Staff
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
 *               - email
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: staff@company.com
 *               role:
 *                 type: string
 *                 enum: [owner, manager, staff]
 *     responses:
 *       201:
 *         description: Staff invite sent successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

router.post(
  '/:businessId/invite',
  authMiddleware,
  requireBusinessPermission(BusinessPermission.STAFF_INVITE),
  BusinessStaffController.inviteStaff
)

export default router;
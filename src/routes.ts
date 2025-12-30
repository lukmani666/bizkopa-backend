import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import businessRoutes from './modules/businesses/business.routes';
import businessStaffRoutes from './modules/business-staff/business-staff.routes';
import avatarRoute from './modules/uploads/upload.routes'

const router = Router();

router.use('/auth', authRoutes);
router.use('/business', businessRoutes);
router.use('/business-staff', businessStaffRoutes);
router.use('', avatarRoute);

export default router;
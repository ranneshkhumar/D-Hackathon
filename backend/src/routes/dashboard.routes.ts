import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Protect dashboard endpoints
router.use(authMiddleware);

router.get('/', DashboardController.getSummary);

export const dashboardRouter = router;

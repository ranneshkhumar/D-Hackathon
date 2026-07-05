import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router = Router();

// Expose health status check publicly
router.get('/', HealthController.checkHealth);

export const healthRouter = router;

import { Router } from 'express';
import { StrategyController } from '../controllers/strategy.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Protect strategy endpoints
router.use(authMiddleware);

router.post('/', StrategyController.generate);

export const strategyRouter = router;

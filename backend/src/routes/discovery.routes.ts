import { Router } from 'express';
import { DiscoveryController } from '../controllers/discovery.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Protect onboarding routes
router.use(authMiddleware);

router.post('/start', DiscoveryController.start);
router.post('/message', DiscoveryController.message);

export const discoveryRouter = router;

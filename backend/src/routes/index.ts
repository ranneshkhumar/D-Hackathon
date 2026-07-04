import { Router } from 'express';
import { authRouter } from './auth.routes';
import { orgRouter } from './org.routes';
import { discoveryRouter } from './discovery.routes';
import { strategyRouter } from './strategy.routes';
import { chatRouter } from './chat.routes';
import { dashboardRouter } from './dashboard.routes';

const router = Router();

// Register all modular routers
router.use('/auth', authRouter);
router.use('/organization', orgRouter);
router.use('/discovery', discoveryRouter);
router.use('/strategy', strategyRouter);
router.use('/chat', chatRouter);
router.use('/dashboard', dashboardRouter);

export const apiRouter = router;

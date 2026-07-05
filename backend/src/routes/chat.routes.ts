import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Protect chat endpoints
router.use(authMiddleware);

router.post('/', ChatController.message);

export const chatRouter = router;

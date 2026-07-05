import { Router } from 'express';
import multer from 'multer';
import { DiscoveryController } from '../controllers/discovery.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Protect onboarding routes
router.use(authMiddleware);

router.post('/start', DiscoveryController.start);
router.post('/message', DiscoveryController.message);
router.post('/submit', DiscoveryController.submit);
router.post('/upload-csv', upload.single('file'), DiscoveryController.uploadCsv);

export const discoveryRouter = router;

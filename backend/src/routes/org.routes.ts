import { Router } from 'express';
import { OrgController } from '../controllers/org.controller';
import { authMiddleware } from '../middleware/auth';
import { validateBody } from '../middleware/validator';
import { CreateOrgSchema, AddMetricSchema } from '../validators/org.validator';

const router = Router();

// Secure all organization endpoints under JWT validation
router.use(authMiddleware);

router.post('/', validateBody(CreateOrgSchema), OrgController.createOrg);
router.get('/:id', OrgController.getOrg);
router.put('/:id', OrgController.updateProfile);
router.post('/:id/metrics', validateBody(AddMetricSchema), OrgController.addMetric);

export const orgRouter = router;

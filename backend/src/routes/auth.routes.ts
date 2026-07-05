import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validator';
import { RegisterSchema, LoginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validateBody(RegisterSchema), AuthController.register);
router.post('/login', validateBody(LoginSchema), AuthController.login);

export const authRouter = router;

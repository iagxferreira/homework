import { Router } from 'express';
import { signup, signin } from '../controllers/authController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

router.post('/signup', signup);
router.post('/signin', signin);

export default router;
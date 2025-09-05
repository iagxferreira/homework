import { Router } from 'express';
import { getUserVotingHistory } from '../controllers/voteController';
import { authenticate } from '../middleware/auth';
import { requireAnyRole } from '../middleware/authorize';

const router = Router();

router.get('/users/:userId/votes', authenticate, requireAnyRole, getUserVotingHistory);

export default router;
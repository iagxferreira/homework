import { Router } from 'express';
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  addCandidateToCampaign,
  removeCandidateFromCampaign,
} from '../controllers/campaignController';
import {
  castVote,
  getCampaignResults,
  getUserVotingHistory,
  getUserVoteInCampaign,
} from '../controllers/voteController';
import { authenticate } from '../middleware/auth';
import { requireAdmin, requireAnyRole } from '../middleware/authorize';

const router = Router();

router.post('/', authenticate, requireAdmin, createCampaign);
router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.put('/:id', authenticate, requireAdmin, updateCampaign);

router.post('/:id/candidates', authenticate, requireAdmin, addCandidateToCampaign);
router.delete('/:id/candidates/:candidateId', authenticate, requireAdmin, removeCandidateFromCampaign);

router.post('/:id/vote', authenticate, requireAnyRole, castVote);
router.get('/:id/results', getCampaignResults);
router.get('/:id/my-vote', authenticate, requireAnyRole, getUserVoteInCampaign);

export default router;
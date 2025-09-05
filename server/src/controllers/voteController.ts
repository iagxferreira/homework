import { Request, Response } from 'express';
import Campaign, { CampaignStatus } from '../models/Campaign';
import Vote from '../models/Vote';
import { UserRole } from '../models/User';

interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

/**
 * @swagger
 * /api/campaigns/{id}/vote:
 *   post:
 *     summary: Vote for a candidate in a campaign
 *     tags: [Voting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - candidateId
 *             properties:
 *               candidateId:
 *                 type: string
 *                 description: ID of the candidate to vote for
 *     responses:
 *       201:
 *         description: Vote cast successfully
 *       400:
 *         description: Invalid vote request
 *       403:
 *         description: Voting not allowed
 *       404:
 *         description: Campaign or candidate not found
 *       409:
 *         description: User has already voted in this campaign
 */
export const castVote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { candidateId } = req.body;
    const campaignId = req.params.id;
    const voterId = req.user!._id;

    if (!candidateId) {
      res.status(400).json({ message: 'Candidate ID is required' });
      return;
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    if (campaign.status !== CampaignStatus.ACTIVE) {
      res.status(403).json({ message: 'Voting is not currently allowed for this campaign' });
      return;
    }

    const now = new Date();
    if (now < campaign.startDate || now > campaign.endDate) {
      res.status(403).json({ message: 'Voting period has not started or has ended' });
      return;
    }

    const candidate = campaign.candidates.find(
      c => c.user.toString() === candidateId
    );

    if (!candidate) {
      res.status(404).json({ message: 'Candidate not found in this campaign' });
      return;
    }

    const existingVote = await Vote.findOne({
      campaign: campaignId,
      voter: voterId,
    });

    if (existingVote) {
      res.status(409).json({ message: 'You have already voted in this campaign' });
      return;
    }

    const vote = new Vote({
      campaign: campaignId,
      voter: voterId,
      candidate: candidateId,
      votedAt: new Date(),
    });

    await vote.save();

    candidate.voteCount += 1;
    campaign.totalVotes += 1;
    await campaign.save();

    res.status(201).json({
      message: 'Vote cast successfully',
      vote: {
        campaign: campaignId,
        candidate: candidateId,
        votedAt: vote.votedAt,
      },
    });
  } catch (error) {
    console.error('Cast vote error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/campaigns/{id}/results:
 *   get:
 *     summary: Get voting results for a campaign
 *     tags: [Voting]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Voting results
 *       404:
 *         description: Campaign not found
 */
export const getCampaignResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('candidates.user', 'name email');

    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    const results = campaign.candidates
      .map(candidate => ({
        candidate: {
          _id: (candidate.user as any)._id,
          name: (candidate.user as any).name,
          email: (candidate.user as any).email,
        },
        description: candidate.description,
        voteCount: candidate.voteCount,
        percentage: campaign.totalVotes > 0 
          ? Math.round((candidate.voteCount / campaign.totalVotes) * 100 * 100) / 100 
          : 0,
      }))
      .sort((a, b) => b.voteCount - a.voteCount);

    res.json({
      campaign: {
        _id: campaign._id,
        title: campaign.title,
        description: campaign.description,
        status: campaign.status,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        totalVotes: campaign.totalVotes,
        createdBy: campaign.createdBy,
      },
      results,
    });
  } catch (error) {
    console.error('Get campaign results error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/users/{userId}/votes:
 *   get:
 *     summary: Get user's voting history
 *     tags: [Voting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User's voting history
 *       403:
 *         description: Not authorized to view this user's votes
 */
export const getUserVotingHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (req.user!._id !== userId && req.user!.role !== UserRole.ADMIN) {
      res.status(403).json({ message: 'Not authorized to view this user\'s voting history' });
      return;
    }

    const votes = await Vote.find({ voter: userId })
      .populate('campaign', 'title description status startDate endDate')
      .populate('candidate', 'name email')
      .sort({ votedAt: -1 });

    res.json({
      votes: votes.map(vote => ({
        _id: vote._id,
        campaign: vote.campaign,
        candidate: vote.candidate,
        votedAt: vote.votedAt,
      })),
    });
  } catch (error) {
    console.error('Get user voting history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/campaigns/{id}/my-vote:
 *   get:
 *     summary: Check if current user has voted in a campaign
 *     tags: [Voting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: User's vote status
 *       404:
 *         description: Campaign not found
 */
export const getUserVoteInCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaignId = req.params.id;
    const voterId = req.user!._id;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    const vote = await Vote.findOne({
      campaign: campaignId,
      voter: voterId,
    }).populate('candidate', 'name email');

    res.json({
      hasVoted: !!vote,
      vote: vote ? {
        candidate: vote.candidate,
        votedAt: vote.votedAt,
      } : null,
    });
  } catch (error) {
    console.error('Get user vote in campaign error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
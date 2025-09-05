import { Request, Response } from 'express';
import Campaign, { ICampaign, CampaignStatus } from '../models/Campaign';
import User, { UserRole } from '../models/User';
import Vote from '../models/Vote';

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
 * /api/campaigns:
 *   post:
 *     summary: Create a new campaign (Admin only)
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
export const createCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, startDate, endDate } = req.body;

    if (!title || !description || !startDate || !endDate) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      res.status(400).json({ message: 'End date must be after start date' });
      return;
    }

    if (start < new Date()) {
      res.status(400).json({ message: 'Start date cannot be in the past' });
      return;
    }

    const campaign = new Campaign({
      title,
      description,
      startDate: start,
      endDate: end,
      createdBy: req.user!._id,
      status: CampaignStatus.DRAFT,
    });

    await campaign.save();
    await campaign.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign,
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/campaigns:
 *   get:
 *     summary: Get all campaigns
 *     tags: [Campaigns]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, active, completed, cancelled]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of campaigns
 */
export const getCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let filter: any = {};
    if (status) {
      filter.status = status;
    }

    const campaigns = await Campaign.find(filter)
      .populate('createdBy', 'name email')
      .populate('candidates.user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Campaign.countDocuments(filter);

    res.json({
      campaigns,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
      },
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/campaigns/{id}:
 *   get:
 *     summary: Get campaign by ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign details
 *       404:
 *         description: Campaign not found
 */
export const getCampaignById = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('candidates.user', 'name email');

    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    res.json({ campaign });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/campaigns/{id}:
 *   put:
 *     summary: Update campaign (Admin only)
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [draft, active, completed, cancelled]
 *     responses:
 *       200:
 *         description: Campaign updated successfully
 *       404:
 *         description: Campaign not found
 *       403:
 *         description: Not authorized to update this campaign
 */
export const updateCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    if (campaign.createdBy.toString() !== req.user!._id && req.user!.role !== UserRole.ADMIN) {
      res.status(403).json({ message: 'Not authorized to update this campaign' });
      return;
    }

    const { title, description, startDate, endDate, status } = req.body;

    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (startDate) campaign.startDate = new Date(startDate);
    if (endDate) campaign.endDate = new Date(endDate);
    if (status) campaign.status = status;

    await campaign.save();
    await campaign.populate('createdBy', 'name email');
    await campaign.populate('candidates.user', 'name email');

    res.json({
      message: 'Campaign updated successfully',
      campaign,
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/campaigns/{id}/candidates:
 *   post:
 *     summary: Add candidate to campaign (Admin only)
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Candidate added successfully
 *       400:
 *         description: User not found or already a candidate
 *       404:
 *         description: Campaign not found
 */
export const addCandidateToCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, description } = req.body;

    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const isAlreadyCandidate = campaign.candidates.some(
      candidate => candidate.user.toString() === userId
    );

    if (isAlreadyCandidate) {
      res.status(400).json({ message: 'User is already a candidate in this campaign' });
      return;
    }

    campaign.candidates.push({
      user: userId,
      description: description || '',
      voteCount: 0,
    });

    await campaign.save();
    await campaign.populate('candidates.user', 'name email');

    res.json({
      message: 'Candidate added successfully',
      campaign,
    });
  } catch (error) {
    console.error('Add candidate error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/campaigns/{id}/candidates/{candidateId}:
 *   delete:
 *     summary: Remove candidate from campaign (Admin only)
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidate removed successfully
 *       404:
 *         description: Campaign or candidate not found
 */
export const removeCandidateFromCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    const candidateIndex = campaign.candidates.findIndex(
      candidate => candidate._id?.toString() === req.params.candidateId
    );

    if (candidateIndex === -1) {
      res.status(404).json({ message: 'Candidate not found in campaign' });
      return;
    }

    const removedCandidate = campaign.candidates[candidateIndex];
    campaign.candidates.splice(candidateIndex, 1);
    campaign.totalVotes -= removedCandidate.voteCount;

    await Vote.deleteMany({ 
      campaign: campaign._id, 
      candidate: removedCandidate.user 
    });

    await campaign.save();

    res.json({
      message: 'Candidate removed successfully',
      campaign,
    });
  } catch (error) {
    console.error('Remove candidate error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
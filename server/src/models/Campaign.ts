import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface ICampaignCandidate {
  _id?: string;
  user: IUser['_id'];
  description?: string;
  voteCount: number;
}

export interface ICampaign extends Document {
  title: string;
  description: string;
  status: CampaignStatus;
  startDate: Date;
  endDate: Date;
  createdBy: IUser['_id'];
  candidates: ICampaignCandidate[];
  totalVotes: number;
  createdAt: Date;
  updatedAt: Date;
}

const campaignCandidateSchema = new Schema<ICampaignCandidate>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  voteCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  _id: true,
});

const campaignSchema = new Schema<ICampaign>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  status: {
    type: String,
    enum: Object.values(CampaignStatus),
    default: CampaignStatus.DRAFT,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(this: ICampaign, value: Date) {
        return value > this.startDate;
      },
      message: 'End date must be after start date',
    },
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  candidates: [campaignCandidateSchema],
  totalVotes: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

campaignSchema.index({ status: 1, startDate: 1, endDate: 1 });
campaignSchema.index({ createdBy: 1 });

export default mongoose.model<ICampaign>('Campaign', campaignSchema);
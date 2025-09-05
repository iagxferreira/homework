import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ICampaign } from './Campaign';

export interface IVote extends Document {
  campaign: ICampaign['_id'];
  voter: IUser['_id'];
  candidate: IUser['_id'];
  votedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const voteSchema = new Schema<IVote>({
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  voter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  candidate: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  votedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
}, {
  timestamps: true,
});

voteSchema.index({ campaign: 1, voter: 1 }, { unique: true });
voteSchema.index({ campaign: 1, candidate: 1 });
voteSchema.index({ voter: 1 });

export default mongoose.model<IVote>('Vote', voteSchema);
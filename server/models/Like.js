import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    songTitle: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness per user and song
likeSchema.index({ userId: 1, songTitle: 1 }, { unique: true });

export const Like = mongoose.model('Like', likeSchema);
export default Like;

import mongoose from 'mongoose';
import PointSchema from './utils/PointSchema';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
    location: {
      type: PointSchema,
      index: '2dsphere',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Post', PostSchema);

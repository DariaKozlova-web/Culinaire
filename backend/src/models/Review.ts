import { model, Schema } from 'mongoose';

const ReviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

const Review = model('Review', ReviewSchema);
export default Review;

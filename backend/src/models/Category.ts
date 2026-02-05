import { model, Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    image: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export default model('Category', categorySchema);

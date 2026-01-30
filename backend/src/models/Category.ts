import { model, Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    url: { type: String, required: [true, 'URL is required'], trim: true },
    image: { type: String, required: [true, 'Image is required'], trim: true }
  },
  {
    timestamps: true
  }
);

export default model('Category', categorySchema);

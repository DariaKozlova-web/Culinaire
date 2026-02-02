import { model, Schema } from 'mongoose';

const chefSchema = new Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    url: { type: String, required: [true, 'URL is required'], trim: true },
    image: { type: String, required: [true, 'Image is required'], trim: true },
    city: { type: String, required: [true, 'City is required'], trim: true },
    cuisine: { type: String, required: [true, 'Cuisine is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    story: {
      type: [String],
      required: [true, 'Story is required']
    },
    signature: { type: String, required: [true, 'Signature is required'], trim: true },
    restaurant: {
      type: new Schema(
        {
          name: { type: String, required: true, trim: true },
          address: { type: String, required: true, trim: true },
          openingHours: { type: String, required: true, trim: true },
          closed: { type: String, required: true, trim: true }
        },
        { _id: false }
      ),
      required: [true, 'Restaurant data is required']
    }
  },
  { timestamps: true }
);

export default model('Chef', chefSchema);

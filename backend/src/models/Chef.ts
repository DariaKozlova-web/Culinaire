import { model, Schema } from 'mongoose';

const chefSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    city: { type: String, required: true },
    cuisine: { type: String, required: true },
    description: { type: String, required: true },
    story: {
      type: [String],
      required: [true, 'Story is required']
    },
    signature: { type: String, required: true },
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

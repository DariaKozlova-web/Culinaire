import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is not valid']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
      minlength: [12, 'Password must be at least 6 characters long']
    },
    roles: {
      type: [String],
      default: ['user'],
      required: true
    },
    image: {
      type: String,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

const User = model('User', userSchema);

export default User;

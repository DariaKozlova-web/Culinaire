import { v2 as cloudinary } from 'cloudinary';
import { type RequestHandler } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

const cloudUploaderChef: RequestHandler = async (req, _res, next) => {
  try {
    if (!req.image) return next();

    const hasMain = !!req.image;

    if (!hasMain) return next();

    const slug = req.body.url || 'temp';

    // main image
    if (req.image) {
      const uploaded = await cloudinary.uploader.upload(req.image.filepath, {
        folder: `culinaire/chefs/${slug}`,
        public_id: `${slug}`
      });
      req.body.image = uploaded.secure_url;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default cloudUploaderChef;

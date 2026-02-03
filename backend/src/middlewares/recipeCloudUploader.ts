import { v2 as cloudinary } from 'cloudinary';
import { type RequestHandler } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

const cloudUploaderRecipe: RequestHandler = async (req, _res, next) => {
  try {
    if (!req.images) return next();

    const slug = req.body.url || 'temp';

    // main image
    if (req.images.main) {
      const uploaded = await cloudinary.uploader.upload(req.images.main.filepath, {
        folder: `culinaire/recipes/${slug}`,
        public_id: `${slug}-main`
      });
      req.body.image = uploaded.secure_url;
    }

    // step images
    if (req.images.steps?.length && Array.isArray(req.body.instructions)) {
      let index = 0;

      for (const file of req.images.steps) {
        if (!file || !req.body.instructions[index]) continue;

        const uploaded = await cloudinary.uploader.upload(file.filepath, {
          folder: `culinaire/recipes/${slug}`,
          public_id: `${slug}-step${index + 1}`
        });

        req.body.instructions[index].image = uploaded.secure_url;
        index++;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default cloudUploaderRecipe;

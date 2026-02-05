import { v2 as cloudinary } from 'cloudinary';
import { type RequestHandler } from 'express';
import {Recipe} from '#models';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

function pickFirstString(val: unknown):string {
  if(Array.isArray(val)) return typeof val[0]==="string"?val[0]:"";
  return typeof val === "string"?val:"";
}

function normalizeSlug(val: unknown):string{
  return pickFirstString(val).trim().toLocaleLowerCase();
}

const cloudUploaderRecipe: RequestHandler = async (req, _res, next) => {
  try {
    if (!req.images) return next();

     let slug = normalizeSlug(req.body?.url);

     //If this is an UPDATE and the slug hasn't arrived, we take it from the database.
     if (!slug && req.method === "PUT" && req.params?.id) {
      const existing = await Recipe.findById(req.params.id).select("url");
      if (existing?.url) slug = existing.url.trim().toLowerCase();
    }

    if (!slug) slug = 'temp';

    const hasMain = !!req.images.main;
    const hasSteps = Array.isArray(req.images.steps) && req.images.steps?.length > 0;

    if(!hasMain&&!hasSteps) return next();



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

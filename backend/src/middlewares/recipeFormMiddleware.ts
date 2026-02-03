import { type RequestHandler } from 'express';
import formidable, { type Files, type Part } from 'formidable';

const maxFileSize = 10 * 1024 * 1024;

const filter = ({ mimetype }: Part) => {
  if (!mimetype?.includes('image')) {
    throw new Error('Only images allowed', { cause: { status: 400 } });
  }
  return true;
};

const recipeFormMiddleware: RequestHandler = (req, _res, next) => {
  const form = formidable({
    multiples: true,
    maxFileSize,
    filter
  });

  form.parse(req, (err, fields, files: Files) => {
    if (err) return next(err);

    req.body = fields;
    console.log('FIELDS keys:', Object.keys(fields));
    console.log('categoryId:', fields.categoryId);
    console.log('chefId:', fields.chefId);
    console.log('ingredients raw:', fields.ingredients);
    console.log('instructions raw:', fields.instructions);

    req.images = {
      main: files.image?.[0], // main recipe image
      steps: files.instructionImages || [] // step images
    };

    next();
  });
};

export default recipeFormMiddleware;

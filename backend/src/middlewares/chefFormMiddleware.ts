import { type RequestHandler } from 'express';
import formidable, { type Files, type Part } from 'formidable';

const maxFileSize = 10 * 1024 * 1024;

const filter = ({ mimetype }: Part) => {
  if (!mimetype?.includes('image')) {
    throw new Error('Only images allowed', { cause: { status: 400 } });
  }
  return true;
};

const chefFormMiddleware: RequestHandler = (req, _res, next) => {
  const form = formidable({
    multiples: true,
    maxFileSize,
    filter
  });

  form.parse(req, (err, fields, files: Files) => {
    if (err) return next(err);

    req.body = fields;
    if (files.image && files.image.length > 0) {
      req.image = files.image[0];
    }

    next();
  });
};

export default chefFormMiddleware;

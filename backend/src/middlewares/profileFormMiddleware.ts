import { type RequestHandler } from 'express';
import formidable, { type Fields, type Files, type Part, File } from 'formidable';

const maxFileSize = 10 * 1024 * 1024;

const filter = ({ mimetype }: Part) => {
  if (!mimetype || !mimetype.includes('image')) {
    return false;
  }
  return true;
};

declare module 'express-serve-static-core' {
  interface Request {
    image?: File;
  }
}

const profileFormMiddleware: RequestHandler = (req, res, next) => {
  const form = formidable({ filter, maxFileSize });

  form.parse(req, (err: any, fields: Fields, files: Files) => {
    if (err) {
      next(err);
    }

    req.body = fields;
    if (files?.image && files.image.length > 0) {
      req.image = files.image[0];
    }

    next();
  });
};

export default profileFormMiddleware;

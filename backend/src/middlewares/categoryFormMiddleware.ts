import { type RequestHandler } from 'express';
import formidable, { type Fields, type Files, type Part, File } from 'formidable';

const maxFileSize = 10 * 1024 * 1024;

const filter = ({ mimetype }: Part) => {
  if (!mimetype || !mimetype.includes('image')) {
    throw new Error('Only images are allowed', { cause: { status: 400 } });
  }
  return true;
};

declare module 'express-serve-static-core' {
  interface Request {
    image?: File;
  }
}

const categoryFormMiddleware: RequestHandler = (req, res, next) => {
  const form = formidable({ filter, maxFileSize });

  form.parse(req, (err: any, fields: Fields, files: Files) => {
    if (err) {
      next(err);
    }

    if (!files || !files.image)
      throw new Error('Please upload a file.', {
        cause: { status: 400 }
      });

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const url = Array.isArray(fields.url) ? fields.url[0] : fields.url;

    req.body = { name, url };
    if (files.image && files.image.length > 0) {
      req.image = files.image[0];
    }
    next();
  });
};

export default categoryFormMiddleware;

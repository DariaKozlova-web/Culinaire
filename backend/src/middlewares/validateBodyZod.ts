import type { RequestHandler } from 'express';
import type { ZodObject } from 'zod/v4';
import { z } from 'zod/v4';

const validateBodyZod =
  (zodSchema: ZodObject): RequestHandler =>
  (req, _res, next) => {
    try {
      const { data, error, success } = zodSchema.safeParse(req.body);

      if (!success) {
        return next(
          new Error(z.prettifyError(error), {
            cause: { status: 400 }
          })
        );
      }

      req.body = data;
      return next();
    } catch (err) {
      return next(err);
    }
  };

export default validateBodyZod;
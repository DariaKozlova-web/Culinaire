import type { File } from 'formidable';

declare global {
  namespace Express {
    interface Request {
      images?: {
        main?: File;
        steps?: File[];
      }
    }
  }
}

export {};
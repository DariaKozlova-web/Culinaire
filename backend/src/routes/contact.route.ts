import { Router } from 'express';
import { sendContactEmail } from '#controllers';
import { validateBodyZod } from '#middlewares';
import { contactSchema } from '#schemas';

const contactRouter = Router();

contactRouter.post('/', validateBodyZod(contactSchema), sendContactEmail);

export default contactRouter;

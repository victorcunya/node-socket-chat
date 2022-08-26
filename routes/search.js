

import { Router } from 'express';
import { search } from '../controllers/search.js';

const searchRouter = Router();

searchRouter.get('/:collection/:term', search);


export { searchRouter };


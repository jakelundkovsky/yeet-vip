import { Router } from 'express';

import getTransactionsForUser from './get-transactions-for-user';

const transactionsRouter = Router();

transactionsRouter.use(getTransactionsForUser);

export default transactionsRouter;

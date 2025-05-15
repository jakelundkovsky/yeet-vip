import { Router } from 'express';

import creditUser from './credit-user';
import getUser from './get-user';
import getUserTransactions from './get-user-transactions';
import getUsers from './get-users';

const userRouter = Router();

userRouter.use(getUsers);
userRouter.use(getUser);
userRouter.use(getUserTransactions);
userRouter.use(creditUser);

export default userRouter;

import { Router } from 'express';
import getUsers from './get-users';
import getUser from './get-user';
import getUserTransactions from './get-user-transactions';
import creditUser from './credit-user';

const userRouter = Router();

userRouter.use(getUsers);
userRouter.use(getUser);
userRouter.use(getUserTransactions);
userRouter.use(creditUser);

export default userRouter;

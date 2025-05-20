import { Router } from 'express';

import updateUserBalance from './update-user-balance';
import getUser from './get-user';
import getUsers from './get-users';

const userRouter = Router();

userRouter.use(getUsers);
userRouter.use(getUser);
userRouter.use(updateUserBalance);

export default userRouter;

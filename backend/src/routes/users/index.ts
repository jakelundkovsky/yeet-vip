import { Router } from 'express';

import getUser from './get-user';
import getUsers from './get-users';
import updateUserBalance from './update-user-balance';

const userRouter = Router();

userRouter.use(getUsers);
userRouter.use(getUser);
userRouter.use(updateUserBalance);

export default userRouter;

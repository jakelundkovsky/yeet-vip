import { Router } from 'express';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';

const router = Router();

router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } });
        res.json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 
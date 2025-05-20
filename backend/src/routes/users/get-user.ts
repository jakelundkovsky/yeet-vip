import { Router } from 'express';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';

const router = Router();

router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                user: null,
                error: 'User ID is required'
            });
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({
                user: null,
                error: 'User not found'
            });
        }

        return res.json({
            user,
            error: null
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            user: null,
            error: 'Internal server error'
        });
    }
});

export default router; 
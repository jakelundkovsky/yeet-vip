import { Router } from 'express';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        
        const page = Number(req.query['page']) || 1;
        const limit = Number(req.query['limit']) || 10;
        const sortBy = String(req.query['sortBy'] || 'createdAt');
        const sortOrder = String(req.query['sortOrder'] || 'DESC').toUpperCase();
        
        // Validate sort parameters
        const allowedSortFields = ['name', 'email', 'balance', 'createdAt'];
        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({
                users: [],
                pagination: null,
                error: 'Invalid sort field'
            });
        }
        if (!['ASC', 'DESC'].includes(sortOrder)) {
            return res.status(400).json({
                users: [],
                pagination: null,
                error: 'Invalid sort order'
            });
        }
        const skip = (page - 1) * limit;
        const total = await userRepository.count();
        const users = await userRepository.find({
            skip,
            take: limit,
            order: { [sortBy]: sortOrder }
        });

        return res.json({
            users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            },
            error: null,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({
            users: [],
            pagination: null,
            error: 'Internal server error'
        });
    }
});

export default router; 
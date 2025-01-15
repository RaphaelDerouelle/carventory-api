import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export const getProtectedData = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({ message: 'Protected data' });
    }
    catch (err) {
        logger.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getProtectedDataWithAuth = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({ message: 'Protected data with auth' });
    }
    catch (err) {
        logger.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
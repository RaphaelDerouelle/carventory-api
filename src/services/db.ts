// db.ts

import { PrismaClient } from '@prisma/client';
import { Manager } from '../Manager/ManagerDef';
import { Events, ServiceStatus } from '../Manager/ManagerTypes'; 
import logger from '../utils/logger';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });



const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'], // add 'query' for debug
  });

export const initDbConnection = async () => {
    try {
        await prisma.$connect();
        Manager.emit(Events.DB_CONNECTION_READY);
    } catch (error) {
        logger.error('DB connection not ready', error);
        Manager.emit(Events.DB_CONNECTION_NOT_READY);
    }
};

export default prisma;

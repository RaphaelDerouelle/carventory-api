import * as protectedController from '../controllers/protected';
import { Router } from 'express';
import logger from '../utils/logger';
import authenticateToken from '../middleware/authMiddleware';

const protectedRouter = Router();

protectedRouter.get('/protected', protectedController.getProtectedData);
protectedRouter.get('/protected-auth', authenticateToken, protectedController.getProtectedDataWithAuth);

export default protectedRouter;
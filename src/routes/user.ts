import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  getUserById
} from '@/controllers/user';
import { checkAdmin } from '@/middleware/checkAdmin';
import { verifyAuth } from '@/middleware/verifyAuth';

const UserRouter = Router();

// Create a new user (Only admins of the company can create users)
UserRouter.post('/users', verifyAuth, checkAdmin, createUser);

// Get all users of a company (Only admins can fetch all users)
UserRouter.get('/users', getAllUsers);

// Get a specific user by ID (Admin can fetch any user)
UserRouter.get('/users/:id', getUserById);

export default UserRouter;

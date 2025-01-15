import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new user (Only admin can create users for a company)
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role, companyId } = req.body;
    const userId = req.user.id; // Assuming `user` is attached to `req` after authentication (e.g., using JWT)

    // First, find the requester (admin user)
    const requester = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!requester) {
      return res.status(404).json({ error: 'Requester not found' });
    }

    // Check if the requester is an admin of the company
    if (requester.role !== 'ADMIN' || requester.companyId !== companyId) {
      return res.status(403).json({ error: 'Only admin users can create users for this company' });
    }

    // Create the new user for the company
    const newUser = await prisma.user.create({
      data: {
        email,
        password, // In a real app, make sure to hash the password before saving it
        role,
        companyId,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
};

// Get all users for a company (for admins only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Assuming `user` is attached to `req` after authentication (e.g., using JWT)

    // Find the requester (admin user)
    const requester = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!requester) {
      return res.status(404).json({ error: 'Requester not found' });
    }

    // Check if the requester is an admin of the company
    if (requester.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admin users can view users for this company' });
    }

    // Fetch all users for the company
    const users = await prisma.user.findMany({
      where: { companyId: requester.companyId },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get a specific user by ID (admin can view any user)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Assuming `user` is attached to `req` after authentication (e.g., using JWT)
    const requestedUserId = req.params.id;

    // Find the requester (admin user)
    const requester = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!requester) {
      return res.status(404).json({ error: 'Requester not found' });
    }

    // Admin can view any user
    if (requester.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admin users can view this user' });
    }

    // Fetch the specific user by ID
    const user = await prisma.user.findUnique({
      where: { id: requestedUserId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
};

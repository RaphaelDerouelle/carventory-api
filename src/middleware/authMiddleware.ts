import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

interface UserPayload {
  userId: string;
  username: string;
  email: string;
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) return res.status(400).json({ error: 'No token provided' });

  console.log('Token:', token);


  jwt.verify(token, JWT_SECRET, (err, user: UserPayload) => {
    if (err) return res.status(401).json({ error: 'Invalid or expired token' });

    req.user = user; // Attach user info to request object
    console.log('User:', user);
    next();
  });
};

export default authenticateToken;

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

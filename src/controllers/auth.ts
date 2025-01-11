import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET 
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "30m"
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || "7d"

type RegisterUserBody = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type VerifyEmailBody = {
    token: string
}

// Mock sendEmail function (replace with actual email sending logic)
const sendEmail = (email: string, url: string) => {
  console.log(`Sending verification link to ${email}: ${url}`);
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, firstName, lastName, email, password }: RegisterUserBody = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (user) {
      res.status(400).json({ error: 'Username or email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
      },
    });

    const verificationToken = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Construct verification URL (this would normally be the front-end URL)
    const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;

    // Mock sending the verification email
    sendEmail(newUser.email, verificationUrl);

    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.',
      user: {
        id: newUser.id,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        emailVerified: newUser.emailVerified,
      },
    });
  } catch (error) {
    logger.error('Failed to register user', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const verifyEmail = async (
    req: Request<{}, {}, VerifyEmailBody>,
    res: Response
  ): Promise<void> => {
    const { token } = req.body
  
    try {
      // Verify the token and extract user email
      const payload = jwt.verify(token, JWT_SECRET) as { email: string }
      const { email } = payload
  
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email },
      })
  
      if (!user) {
        res.status(400).json({ error: "Invalid token" })
        return
      }
  
      // Check if the user is already verified
      if (user.emailVerified) {
        res.status(400).json({ error: "Email is already verified" })
        return
      }
  
      // Update user's email verification status
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { emailVerified: true },
      })
  
      // Create a JWT for the user to log them in automatically
      const authToken = jwt.sign(
        {
          userId: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      )
  
      res.json({ message: "Email verified successfully", token: authToken })
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(400).json({ error: 'Token has expired.' });
        } else {
            res.status(500).json({ error: 'Failed to verify email.' });
        }
    }
  }


  export const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
  
    try {
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        res.status(404).json({ error: "User not found." });
        return;
      }
  
      if (user.emailVerified) {
        res.status(400).json({ error: "Email is already verified." });
        return;
      }
  
      // Create a new verification token
      const verificationToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
  
      // Send the verification email
      sendEmail(user.email, verificationUrl);
  
      res.json({ message: 'Verification email sent successfully.' });
    } catch (error) {
      logger.error('Failed to resend verification email', error);
      res.status(500).json({ error: 'Failed to resend verification email.' });
    }
  };

  export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
  
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
  
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  
      if (!passwordMatch) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
  
      // Generate the access token (short-lived)
      const authToken = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );
  
      // Generate the refresh token (long-lived)
      const refreshToken = jwt.sign(
        {
          userId: user.id,
        },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRATION }
      );
  
      // Send both tokens to the client
      res.json({ token: authToken, refreshToken, user: { email: user.email, username: user.username, id: user.id }})
    } catch (error) {
      console.error("Failed to login user", error);
      res.status(500).json({ error: "Failed to login user" });
    }
  };

  export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is missing" });
    }
  
    try {
      // Verify the refresh token
      const decoded: any = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  
      // Fetch user to validate refresh token
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
  
      if (!user) {
        return res.status(403).json({ error: "Invalid refresh token" });
      }
  
      // Generate a new auth token
      const newAuthToken = jwt.sign(
        { userId: user.id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );
  
      res.json({ token: newAuthToken });
    } catch (error) {
      res.status(403).json({ error: "Invalid refresh token" });
    }
  };
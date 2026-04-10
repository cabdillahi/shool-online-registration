import jwt from 'jsonwebtoken';
import { JwtPayload, Role } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not set in environment variables!');
}

export const generateToken = (userId: string, role: Role): string => {
  return jwt.sign(
    { userId, role } as JwtPayload,
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};
import { Request } from 'express';

// Define enums locally instead of importing from Prisma
// This avoids the generated file path issues

export type Role = 'STUDENT' | 'ADMIN';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type NotificationType = 'SUCCESS' | 'ERROR' | 'INFO';

export interface JwtPayload {
  userId: string;
  role: Role;
}

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export interface RegisterInput {
  email: string;
  password: string;
  role?: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ApplicationInput {
  fullName: string;
  parentName: string;
  phoneNumber1: string;
  phoneNumber2?: string;
}

export interface UpdateStatusInput {
  status: 'APPROVED' | 'REJECTED';
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  userId: string;
  fullName: string;
  parentName: string;
  phoneNumber1: string;
  phoneNumber2: string | null;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  user?: {
    email: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
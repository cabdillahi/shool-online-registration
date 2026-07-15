export type Role = 'STUDENT' | 'ADMIN';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type NotificationType = 'SUCCESS' | 'ERROR' | 'INFO';

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Application {
  id: string;
  userId: string;
  fullName: string;
  parentName: string;
  phoneNumber1: string;
  phoneNumber2?: string | null;
  photoUrl?: string | null;
  documentUrl?: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  user?: {
    email: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface ApplicationFormData {
  fullName: string;
  parentName: string;
  phoneNumber1: string;
  phoneNumber2?: string;
  photo?: File | null;
  document?: File | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
import express from 'express';
import {
  submitApplication,
  getMyApplication,
  getAllApplications,
  updateApplicationStatus,
  getApplicationStats,
  updateApplicationFiles,
} from '../controllers/applicationController';
import { authenticate, authorizeRole } from '../middleware/auth';
import { uploadApplicationFiles } from '../middleware/upload';

const router = express.Router();

// ⚠️ IMPORTANT: More specific routes MUST come BEFORE parameterized routes

// Admin routes - /stats MUST be before /:id routes
router.get('/stats', authenticate, authorizeRole('ADMIN'), getApplicationStats);

// Student routes
router.post(
  '/',
  authenticate,
  authorizeRole('STUDENT'),
  uploadApplicationFiles,
  submitApplication
);
router.get('/my-application', authenticate, authorizeRole('STUDENT'), getMyApplication);
router.post(
  '/my-application/files',
  authenticate,
  authorizeRole('STUDENT'),
  uploadApplicationFiles,
  updateApplicationFiles
);

// Admin routes
router.get('/', authenticate, authorizeRole('ADMIN'), getAllApplications);
router.patch('/:id/status', authenticate, authorizeRole('ADMIN'), updateApplicationStatus);

export default router;
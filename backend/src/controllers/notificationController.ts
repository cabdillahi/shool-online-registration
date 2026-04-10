import { Response } from 'express';
import { AuthRequest } from '../types';
import prisma from '../utils/prisma';

export const getMyNotifications = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userId = req.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ notifications });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userId = req.user.id;

    const notification = await prisma.notification.findFirst({
      where: {
        id:id.toString(),
        userId
      }
    });

    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    const updatedNotification = await prisma.notification.update({
      where: { id:id.toString() },
      data: { isRead: true }
    });

    res.json({ notification: updatedNotification });
  } catch (error) {
    console.error('Mark notification error:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

export const markAllAsRead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userId = req.user.id;

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications error:', error);
    res.status(500).json({ message: 'Failed to mark notifications as read' });
  }
};
import { Response } from "express";
import {
  ApplicationInput,
  ApplicationStatus,
  AuthRequest,
  UpdateStatusInput,
} from "../types";
import prisma from "../utils/prisma";

export const submitApplication = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      fullName,
      parentName,
      phoneNumber1,
      phoneNumber2,
    }: ApplicationInput = req.body;

    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const userId = req.user.id;

    if (!fullName || !parentName || !phoneNumber1) {
      res.status(400).json({
        message: "Full name, parent name, and phone number 1 are required",
      });
      return;
    }

    const existingApplication = await prisma.application.findUnique({
      where: { userId },
    });

    if (existingApplication) {
      res.status(400).json({
        message: "You have already submitted an application",
      });
      return;
    }

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    const photoFile = files?.photo?.[0];
    const documentFile = files?.document?.[0];

    console.log("Application upload files:", {
      contentType: req.headers["content-type"],
      photo: photoFile?.filename ?? null,
      document: documentFile?.filename ?? null,
      bodyKeys: Object.keys(req.body || {}),
    });

    const application = await prisma.application.create({
      data: {
        userId,
        fullName: fullName.trim(),
        parentName: parentName.trim(),
        phoneNumber1: phoneNumber1.trim(),
        phoneNumber2: phoneNumber2?.trim() || null,
        photoUrl: photoFile?.filename || null,
        documentUrl: documentFile?.filename || null,
      },
    });

    await prisma.notification.create({
      data: {
        userId,
        message:
          "Your application has been submitted successfully and is pending review.",
        type: "INFO",
      },
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Application submission error:", error);
    res.status(500).json({ message: "Failed to submit application" });
  }
};

export const updateApplicationFiles = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const userId = req.user.id;
    const application = await prisma.application.findUnique({
      where: { userId },
    });

    if (!application) {
      res.status(404).json({ message: "No application found" });
      return;
    }

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    const photoFile = files?.photo?.[0];
    const documentFile = files?.document?.[0];

    if (!photoFile && !documentFile) {
      res.status(400).json({ message: "Please upload a photo or document" });
      return;
    }

    const updated = await prisma.application.update({
      where: { userId },
      data: {
        ...(photoFile ? { photoUrl: photoFile.filename } : {}),
        ...(documentFile ? { documentUrl: documentFile.filename } : {}),
      },
      include: {
        user: { select: { email: true } },
      },
    });

    res.status(200).json({
      message: "Files uploaded successfully",
      application: updated,
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: "Failed to upload files" });
  }
};

export const getMyApplication = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const userId = req.user.id;

    const application = await prisma.application.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!application) {
      res.status(404).json({ message: "No application found" });
      return;
    }

    res.status(200).json({ application });
  } catch (error) {
    console.error("Fetch application error:", error);
    res.status(500).json({ message: "Failed to fetch application" });
  }
};

export const getAllApplications = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { status } = req.query;

    const validStatuses: ApplicationStatus[] = [
      "PENDING",
      "APPROVED",
      "REJECTED",
    ];

    let where = {};

    if (
      status &&
      typeof status === "string" &&
      validStatuses.includes(status as ApplicationStatus)
    ) {
      where = { status: status as ApplicationStatus };
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Fetch applications error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status }: UpdateStatusInput = req.body;

    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const adminId = req.user.id;

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      res
        .status(400)
        .json({ message: "Invalid status. Must be APPROVED or REJECTED" });
      return;
    }

    const application = await prisma.application.findUnique({
      where: { id: id.toString() },
    });

    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    const updatedApplication = await prisma.application.update({
      where: { id: id.toString() },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy: adminId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    const message =
      status === "APPROVED"
        ? "🎉 Congratulations! Your application has been approved."
        : "❌ Unfortunately, your application has been rejected.";

    await prisma.notification.create({
      data: {
        userId: application.userId,
        message,
        type: status === "APPROVED" ? "SUCCESS" : "ERROR",
      },
    });

    res.status(200).json({
      message: `Application ${status.toLowerCase()} successfully`,
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({ message: "Failed to update application" });
  }
};

export const getApplicationStats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    console.log("Getting application stats...");
    console.log(req.body);
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({ where: { status: "PENDING" } }),
      prisma.application.count({ where: { status: "APPROVED" } }),
      prisma.application.count({ where: { status: "REJECTED" } }),
    ]);

    console.log("Stats:", { total, pending, approved, rejected });

    res.status(200).json({
      stats: {
        total,
        pending,
        approved,
        rejected,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

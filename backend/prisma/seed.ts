import prisma from "../src/utils/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@school.com" },
    update: {},
    create: {
      email: "admin@school.com",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created:", {
    email: admin.email,
    role: admin.role,
  });

  // Create a sample student user
  const hashedStudentPassword = await bcrypt.hash("student123", 10);

  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      password: hashedStudentPassword,
      role: "STUDENT",
    },
  });

  console.log("✅ Student user created:", {
    email: student.email,
    role: student.role,
  });

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../../generated/prisma/client";

// ✅ Use pg Pool for better connection management
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create pg Pool
const pool = new pg.Pool({
  connectionString,
  max: 10, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client
const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

// Test connection function
const connectDB = async (): Promise<void> => {
  try {
    // Test the connection
    await prisma.$connect();

    // Verify with a simple query
    await prisma.$queryRaw`SELECT 1`;

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

// Disconnect function
const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
  await pool.end();
  console.log("📤 Database disconnected");
};

export { prisma, connectDB, disconnectDB };
export default prisma;

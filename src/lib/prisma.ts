import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Create reference to global Node.js object to store PrismaClient instance
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// Export 'prisma'
// If it already exists on global object (hot-reloading), we reuse it
// If it doesn't (first startup or production) we instantiate it with our Driver Adapter (PrismaPg)
export const prisma =
  globalForPrisma.prisma || new PrismaClient({adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

// When in development mode, save our new instance as the global object for reuse on hot-reload
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
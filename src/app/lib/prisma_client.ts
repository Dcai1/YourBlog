import { PrismaClient } from "@prisma/client";

const GlobalPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  GlobalPrisma.prisma ??
  new PrismaClient({
    // Output all Prisma Client logs to the console
    log: ["query"],
  });

// Save client in development mode only
if (process.env.NODE_ENV !== "production") {
  GlobalPrisma.prisma = prisma;
}

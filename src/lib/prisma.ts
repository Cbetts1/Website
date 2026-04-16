import path from "path";
import { PrismaClient } from "@/generated/prisma/client";

function createPrismaClient() {
  const url =
    process.env.DATABASE_URL ??
    `file:${path.resolve(process.cwd(), "prisma/dev.db")}`;
  return new PrismaClient({ datasources: { db: { url } } });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

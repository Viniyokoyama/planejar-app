import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrisma() {
  const rawUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  // Resolve relative paths to absolute for libsql
  let url = rawUrl;
  if (rawUrl.startsWith("file:./") || rawUrl.startsWith("file:prisma/")) {
    const rel = rawUrl.replace(/^file:/, "");
    url = `file:${path.resolve(process.cwd(), rel)}`;
  }
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

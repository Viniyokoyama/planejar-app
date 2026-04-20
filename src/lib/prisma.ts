import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createClient(): PrismaClient {
  try {
    return new PrismaClient({ adapter: undefined as any });
  } catch {
    // Prisma 7 may fail without a proper adapter in serverless/build environments.
    // Return a proxy that throws helpful errors only when actually accessed at runtime.
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === "then" || prop === Symbol.toPrimitive || prop === Symbol.toStringTag) {
          return undefined;
        }
        throw new Error(
          `Prisma is not available in this environment (tried to access .${String(prop)}). ` +
          `Set DEMO_MODE=1 or configure a database adapter.`
        );
      },
    });
  }
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

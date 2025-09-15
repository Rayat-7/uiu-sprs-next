let PrismaClient: any

try {
  // Try to import PrismaClient
  const prismaModule = require("@prisma/client")
  PrismaClient = prismaModule.PrismaClient
} catch (error) {
  // If Prisma client is not generated, create a mock
  console.warn("Prisma client not generated. Run 'npm run db:generate' to generate the client.")
  PrismaClient = class MockPrismaClient {
    user = {
      upsert: async () => ({}),
      findUnique: async () => null,
      findMany: async () => [],
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    }
    report = {
      findMany: async () => [],
      create: async () => ({}),
      findUnique: async () => null,
      update: async () => ({}),
      count: async () => 0,
    }
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

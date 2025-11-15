// Use the generated client that was output to `app/generated/prisma`.
// The project generator sets `output = "../app/generated/prisma"` in `schema.prisma`,
// so import from that path instead of `@prisma/client` to avoid runtime import issues.
// Import the generated client entrypoint directly.
import { PrismaClient } from "../app/generated/prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
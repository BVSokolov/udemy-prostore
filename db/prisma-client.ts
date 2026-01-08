import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/lib/generated/prisma/client"

export default function getClient() {
  const connectionString = `${process.env.DATABASE_URL}`
  const adapter = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({ adapter })
  return prisma
}

import getClient from "./prisma-client"
import sampleData from "./sample-data"

async function main() {
  const prisma = getClient()
  await prisma.product.deleteMany()
  await prisma.product.createMany({ data: sampleData.products })

  console.log("Database seeded successfully!")
}

main()

"use server"
import { prisma } from "@/db/prisma-client"
import { convertToPlainObject } from "../utils"
import { LATEST_PRODUCTS_LIMIT } from "../constants"
import { Product } from "@/types"

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  })
  return convertToPlainObject(data)
}

// Get single product by it's slug
export async function getProductBySlug(slug: Product["slug"]) {
  return await prisma.product.findFirst({
    where: { slug },
  })
}

"use server"

import z from "zod"
import { insertReviewSchema } from "../validators"
import { formatError } from "../utils"
import { prisma } from "@/db/prisma-client"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

// Create & Update Reviews
export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>,
) {
  try {
    const session = await auth()
    if (!session) throw new Error("User is not authenticated")

    const userId = session?.user?.id
    const productId = data.productId

    // Validate and store the review
    const review = insertReviewSchema.parse({
      ...data,
      userId,
    })

    // Get product that is being reviewed
    const product = await prisma.product.findFirst({
      where: { id: productId },
    })

    if (!product) throw new Error("Product not found")

    // Check if user already reviewed
    const reviewExists = await prisma.review.findFirst({
      where: { userId, productId },
    })

    await prisma.$transaction(async (tx) => {
      if (reviewExists) {
        // Update review
        await tx.review.update({ where: { id: reviewExists.id }, data: review })
      } else {
        // Create the review
        await tx.review.create({ data: review })
      }

      // Get avg rating
      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId },
      })

      // Get number of reviews
      const numReviews = await tx.review.count({ where: { productId } })

      // Update the rating and numReviews in product table
      await tx.product.update({
        where: { id: productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews,
        },
      })
    })

    revalidatePath(`/product/${product.slug}`)

    return {
      success: true,
      message: "Review saved successfully",
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Get all reviews for a product
export async function getReviews({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: {
      createdAt: "desc",
    },
  })

  return { data }
}

// Get a review written by the current user
export async function getReviewByProductId({
  productId,
}: {
  productId: string
}) {
  const session = await auth()

  if (!session) throw new Error("User is not authenticated")

  return await prisma.review.findFirst({
    where: {
      userId: session.user.id,
      productId,
    },
  })
}

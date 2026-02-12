"use client"

import { Review } from "@/types"
import Link from "next/link"
import { useEffect, useState } from "react"
import ReviewForm from "./review-form"
import { getReviews } from "@/lib/actions/review.actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar, User } from "lucide-react"
import { formatDateTime } from "@/lib/utils"
import Rating from "@/components/shared/product/rating"

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string
  productId: string
  productSlug: string
}) => {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews({ productId })
      setReviews(res.data)
    }

    loadReviews()
  }, [productId])

  // Reload reviews after created or uploaded
  const reload = async () => {
    const res = await getReviews({ productId })
    setReviews([...res.data])
  }

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={reload}
        />
      ) : (
        <div>
          Please
          <Link
            className="text-blue-700 px-1 underline"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            sign in
          </Link>
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">
        {reviews.map(({ id, title, description, rating, user, createdAt }) => (
          <Card key={id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{title}</CardTitle>
              </div>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground items-center">
                <Rating value={rating} />
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  {user ? user.name : "Deleted User"}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h3 w-3" />
                  {formatDateTime(createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ReviewList

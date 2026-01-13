"use client"

import { Button } from "@/components/ui/button"
import { addItemToCart } from "@/lib/actions/cart.actions"
import { CartItem } from "@/types"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter()

  const handleAddToCart = async () => {
    const res = await addItemToCart(item)

    if (!res.success) {
      toast.error(res.message)
      return
    }

    // Handle success add to cart
    // toast(`${item.name} added to cart`, {
    //   action: {
    //     label: "Go To Cart",
    //     onClick: () => router.push("/cart"),
    //   },
    // })

    toast(`${item.name} added to cart`, {
      action: (
        <Button
          className="bg-primary text-white hover:bg-gray-800 hover:cursor-pointer"
          onClick={() => router.push("/cart")}
        >
          Go To Cart
        </Button>
      ),
    })
  }

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus /> Add To Cart
    </Button>
  )
}

export default AddToCart

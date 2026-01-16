import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/lib/generated/prisma/client"
// import { neonConfig, Pool } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
// import ws from "ws"

// neonConfig.webSocketConstructor = ws
const connectionString = `${process.env.DATABASE_URL}`

// const pool = new Pool({ connectionString })
const adapter = new PrismaNeon({ connectionString })
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString()
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString()
        },
      },
    },
    cart: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString()
        },
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart) {
          return cart.totalPrice.toString()
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart) {
          return cart.shippingPrice.toString()
        },
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(cart) {
          return cart.taxPrice.toString()
        },
      },
    },
    order: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString()
        },
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart) {
          return cart.totalPrice.toString()
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart) {
          return cart.shippingPrice.toString()
        },
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(cart) {
          return cart.taxPrice.toString()
        },
      },
    },
    orderItem: {
      price: {
        compute(cart) {
          return cart.price.toString()
        },
      },
    },
  },
})

export default function getClient() {
  const connectionString = `${process.env.DATABASE_URL}`
  const adapter = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({ adapter })
  return prisma
}

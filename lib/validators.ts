import z from "zod"
import { formatNumberWithDecimal } from "./utils"
import { PAYMENT_METHODS } from "./constants"

const CURRENCY_SCHEMA_VALIDATOR = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places",
  )

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slugh must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number<string>(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: CURRENCY_SCHEMA_VALIDATOR,
})

// Schema for updating a product
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "ID is required"),
})

// Schema for signing user in
const MIN_PW_LENGTH = 6
export const signInFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(
      MIN_PW_LENGTH,
      `Password must be at least ${MIN_PW_LENGTH} characters`,
    ),
})

// Schema for signing up a user
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(
        MIN_PW_LENGTH,
        `Password must be at least ${MIN_PW_LENGTH} characters`,
      ),
    confirmPassword: z
      .string()
      .min(
        MIN_PW_LENGTH,
        `Confirm password must be at least ${MIN_PW_LENGTH} characters`,
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Cart schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: CURRENCY_SCHEMA_VALIDATOR,
})

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: CURRENCY_SCHEMA_VALIDATOR,
  totalPrice: CURRENCY_SCHEMA_VALIDATOR,
  shippingPrice: CURRENCY_SCHEMA_VALIDATOR,
  taxPrice: CURRENCY_SCHEMA_VALIDATOR,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
})

// Schema for the shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  streetAddress: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

// Schema for payment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    error: "Invalid payment method",
  })

// Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: CURRENCY_SCHEMA_VALIDATOR,
  shippingPrice: CURRENCY_SCHEMA_VALIDATOR,
  taxPrice: CURRENCY_SCHEMA_VALIDATOR,
  totalPrice: CURRENCY_SCHEMA_VALIDATOR,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    error: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
})

// Schema for inserting order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: CURRENCY_SCHEMA_VALIDATOR,
  qty: z.number(),
})

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
})

// Schema for updating the user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().min(3, "Email must be at least 3 characters"),
})

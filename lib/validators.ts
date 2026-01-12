import z from "zod"
import { formatNumberWithDecimal } from "./utils"

const CURRENCY_SCHEMA_VALIDATOR = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places"
  )

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slugh must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: CURRENCY_SCHEMA_VALIDATOR,
})

// Schema for signing user in
const MIN_PW_LENGTH = 6
export const signInFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(
      MIN_PW_LENGTH,
      `Password must be at least ${MIN_PW_LENGTH} characters`
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
        `Password must be at least ${MIN_PW_LENGTH} characters`
      ),
    confirmPassword: z
      .string()
      .min(
        MIN_PW_LENGTH,
        `Confirm password must be at least ${MIN_PW_LENGTH} characters`
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

import { z } from "zod";

export const createProductValidator = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must not exceed 100 characters"),

    description: z
        .string()
        .min(5, "Description must be at least 5 characters")
        .max(1000, "Description must not exceed 1000 characters"),

    price: z
        .number()
        .min(0, "Price cannot be negative"),

    category: z
        .string()
        .min(3, "Category must be at least 2 characters"),

    stock: z
        .number()
        .int("Stock must be an integer")
        .min(0, "Stock cannot be negative"),

    image: z
        .string()
        .min(1, "Image is required"),
});

export const updateProductValidator = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must not exceed 100 characters")
        .optional(),

    description: z
        .string()
        .min(5, "Description must be at least 5 characters")
        .max(1000, "Description must not exceed 1000 characters")
        .optional(),

    price: z
        .number()
        .min(0, "Price cannot be negative")
        .optional(),

    category: z
        .string()
        .min(2, "Category must be at least 2 characters")
        .optional(),

    stock: z
        .number()
        .int("Stock must be an integer")
        .min(0, "Stock cannot be negative")
        .optional(),

    image: z
        .string()
        .min(1, "Image is required")
        .optional(),
});
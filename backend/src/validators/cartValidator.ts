import { z } from "zod";

const cartValidator = z.object({
    productId: z
        .string()
        .min(1, "Product ID is required"),

    quantity: z
        .number()
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1"),
});

export default cartValidator;
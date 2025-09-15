import { z } from "zod";

export const transactionFormSchema = z.object({
  type: z.string().min(1, "Type is required"),
  notes: z.string().min(1, "Notes is required"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.string().min(1, "Quantity is required"),
      }),
    )
    .min(1, "At least one product is required"),
});

export type TransactionFormType = z.infer<typeof transactionFormSchema>;

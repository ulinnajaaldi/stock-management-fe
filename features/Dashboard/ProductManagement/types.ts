import { z } from "zod";

export const ProductFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  image: z.string().url("Image must be a valid URL"),
  stock: z.string().min(1, "Stock must be at least 1"),
  categoryId: z.string().min(1, "Category is required"),
});

export const ProductFormEditSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  image: z.string().url("Image must be a valid URL"),
  stock: z.string().min(1, "Stock must be at least 1"),
  categoryId: z.string().min(1, "Category is required"),
});

export type ProductFormType = z.infer<typeof ProductFormSchema>;
export type ProductFormEditType = z.infer<typeof ProductFormEditSchema>;

import { z } from "zod";

export const CategoryFormSchema = z.object({
  name: z.string().min(1).min(1),
  description: z.string().optional(),
});

export type CategoryFormType = z.infer<typeof CategoryFormSchema>;

import { CategoriesResponse } from "./Categories";

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  image: string;
  stock: number;
  category: CategoriesResponse;
  createdAt: string;
  updatedAt: string;
}

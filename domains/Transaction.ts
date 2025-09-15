export interface TransactionResponse {
  id: string;
  type: string;
  notes: string;
  items: Item[];
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  stock: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

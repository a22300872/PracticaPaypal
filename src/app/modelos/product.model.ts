export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  category: string;
  imageUrl: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

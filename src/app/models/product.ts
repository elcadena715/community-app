export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  status: string;
  condition?: string;
  emoji: string;
  owner: string;
}
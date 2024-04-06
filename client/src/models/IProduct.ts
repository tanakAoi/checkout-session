export interface IProduct {
  id: string;
  name: string;
  description: string;
  default_price: {
    unit_amount: number,
    currency: string
  };
  images: string;
}

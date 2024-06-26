export interface IProduct {
  id: string;
  name: string;
  description: string;
  default_price: {
    id: string,
    unit_amount: number,
    currency: string
  };
  images: string;
}

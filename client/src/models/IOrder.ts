interface IOrderProduct {
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  orderNumber: string;
  date: string;
  products: IOrderProduct[];
  discount: number,
  total: number,
  shippingAddress: {
    servicePoint: string;
    city: string;
    street: string;
    postalCode: string;
  };
}

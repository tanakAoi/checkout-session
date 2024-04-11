import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { checkAuth } from "../components/CheckAuth";

interface IOrder {
  orderNumber: string;
  date: string;
  products: IOrderProduct[];
  shippingAddress: {
    servicePoint: string;
    city: string;
    street: string;
    postalCode: string;
  };
}

interface IOrderProduct {
  name: string;
  price: number;
  quantity: number;
}

export const OrderHistory = () => {
  const user = useContext(UserContext);
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    checkAuth(user);
  }, [user.isLoggedIn]);

  useEffect(() => {
    const fetchOrders = async () => {
      const stripeId = user.userData.stripeId;

      if (stripeId) {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/orders/fetch-orders",
            { stripeId }
          );
          setOrders(response.data);
        } catch (error) {
          console.error("Error", error);
        }
      }
    };
    fetchOrders();
  }, [user.isLoggedIn]);

  return (
    <div>
      {orders.map((order) => (
        <div key={order.orderNumber} className="pb-10">
          <p>Order number: {order.orderNumber}</p>
          <p>Order date: {order.date}</p>
          <p>Products: </p>
          {order.products.map((product) => (
            <div key={product.name}>
              <p>{product.name}</p>
              <p>
                {product.price} SEK x {product.quantity}
              </p>
            </div>
          ))}
          <p>Service point: {order.shippingAddress.servicePoint}</p>
          <p>
            Service point address: {order.shippingAddress.street}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.city}
          </p>
        </div>
      ))}
    </div>
  );
};

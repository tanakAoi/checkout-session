import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { Button } from "../components/Button";

interface IOrderProduct {
  name: string;
  price: number;
  quantity: number;
}

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

export const OrderHistory = () => {
  const { isLoggedIn, userData } = useUser();
  const [orders, setOrders] = useState<IOrder[]>(
    JSON.parse(localStorage.getItem("orders") || "[]")
  );

  useEffect(() => {
    const fetchOrders = async () => {
      const stripeId = userData.stripeId;
      console.log(stripeId);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/orders/fetch-orders",
          { stripeId }
        );
        setOrders(response.data);
        localStorage.setItem("orders", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-5">
      {isLoggedIn ? (
        orders.map((order) => (
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
        ))
      ) : (
        <>
          <p>Please Log in to see your order history.</p>
          <Button children={"Login"} size={"sm"} color={"light"} linkTo={"/login"} />
        </>
      )}
    </div>
  );
};

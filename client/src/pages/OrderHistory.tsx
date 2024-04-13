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
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col items-center gap-5 py-20">
      <h2 className="text-3xl pb-10">Order History</h2>
      <div className="flex flex-col gap-5">
        {isLoggedIn ? (
          orders.map((order) => (
            <div
              key={order.orderNumber}
              className="collapse collapse-plus bg-coffee"
            >
              <input type="radio" name="my-accordion-3" defaultChecked />
              <div className="collapse-title text-xl font-medium">
                <p>Order number: {order.orderNumber}</p>
              </div>
              <div className="collapse-content flex flex-col gap-3 *:text-lg">
                <p>Order date: {order.date}</p>
                <p>Products: </p>
                {order.products.map((product) => (
                  <div key={product.name}>
                    <p>
                      {product.name} {product.price} SEK x {product.quantity}
                    </p>
                    <p></p>
                  </div>
                ))}
                <p>Service point: {order.shippingAddress.servicePoint}</p>
                <p>
                  Service point address: {order.shippingAddress.street}{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.city}
                </p>
              </div>
            </div>
          ))
        ) : (
          <>
            <p>Please Log in to see your order history.</p>
            <Button
              children={"Login"}
              size={"sm"}
              color={"light"}
              linkTo={"/login"}
            />
          </>
        )}
      </div>
    </div>
  );
};

import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { Button } from "../components/Button";
import { IOrder } from "../models/IOrder";

export const OrderHistory = () => {
  const { isLoggedIn, userData } = useUser();
  const [orders, setOrders] = useState<IOrder[]>(
    JSON.parse(localStorage.getItem("orders") || "[]")
  );
  const [sortBy, setSortBy] = useState("default");

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

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const sortOrders = (sortBy: string) => {
    const sortedOrders = [...orders].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === "latest" ? dateB - dateA : dateA - dateB;
    });
    return sortedOrders;
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-5 py-20">
      <h2 className="text-3xl pb-10">Order History</h2>
      {isLoggedIn ? (
        orders.length > 0 ? (
          <div className="flex flex-col gap-5">
            <select
              className="select select-bordered max-w-xs"
              value={sortBy}
              onChange={(e) => handleSortChange(e)}
            >
              <option disabled selected value="default">
                Sort by:
              </option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
            {sortOrders(sortBy).map((order) => (
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
                    </div>
                  ))}
                  {order.discount === 0 ? (
                    ""
                  ) : (
                    <p>Discount: {order.discount} SEK</p>
                  )}
                  <p>Total amount: {order.total} SEK</p>
                  <p>Service point: {order.shippingAddress.servicePoint}</p>
                  <p>
                    Service point address: {order.shippingAddress.street}{" "}
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No order history yet 🙂</p>
        )
      ) : (
        <div className="flex flex-col items-center gap-8">
          <p>Please Log in to see your order history.</p>
          <Button
            children={"Login"}
            size={"sm"}
            color={"light"}
            linkTo={"/login"}
          />
        </div>
      )}
    </div>
  );
};

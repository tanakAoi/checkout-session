import { ChangeEvent, useContext, useEffect, useState } from "react";
import axios from "axios";
import { IProduct } from "../models/IProduct";
import { UserContext } from "../contexts/UserContext";

export const Cart = () => {
  const [cartItems, setCartItems] = useState<IProduct[]>(
    JSON.parse(localStorage.getItem("cart-items") || "[]")
  );
  const userContext = useContext(UserContext);

  useEffect(() => {
    const authorize = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/auth/authorize",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        userContext.login(response.data);
      } else {
        userContext.logout();
      }
    };
    authorize();
  }, [userContext.isLoggedIn]);
  
  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const newQuantity = parseInt(e.target.value, 10);

    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleClick = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };


  const checkout = async () => {
    const data = {
      cartItems: cartItems,
      customerId: userContext.userData.stripeId
    }

    const response = await axios.post(
      "http://localhost:3000/api/stripe/checkout",
      data
    );
    window.location = response.data.url;

    if (response.status === 200) {
      localStorage.setItem("cart-items", "[]");
    }
  };

  return (
    <div className="py-10 flex flex-col justify-center gap-10">
      <h2>Cart</h2>
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex flex-col justify-between items-center max-w-xl gap-4"
        >
          <img src={item.images} alt={item.name} className="max-w-xs" />
          <h2 className="font-bold">{item.name}</h2>
          <div className="flex w-full items-center justify-between">
            <p className="font-bold">
              {(item.default_price.unit_amount / 100).toFixed(2)}
              {item.default_price.currency}
            </p>
            <input
              onChange={(e) => handleChange(e, item.id)}
              className="input input-ghost"
              type="number"
              min={1}
              name="quantity"
              id=""
              placeholder="1"
              value={item.quantity}
            />
            <button
              type="button"
              className="btn btn-circle btn-outline"
              name="delete"
              onClick={() => handleClick(item.id)}
            >
              x
            </button>
          </div>
        </div>
      ))}
      <button className="btn" onClick={checkout}>
        Checkout
      </button>
    </div>
  );
};

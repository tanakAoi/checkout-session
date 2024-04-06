import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export const Cart = () => {
  const user = useContext(UserContext);
  const cartItems = user.cartItems;

  return (
    <div>
      <div className="py-10 flex flex-wrap justify-center gap-10">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between items-center max-w-xl gap-4"
          >
            <img src={item.images} alt={item.name} className="max-w-xs" />
            <h2 className="font-bold">{item.name}</h2>
            <p className="max-w-xs">{item.description}</p>
            <div className="flex w-full items-center justify-around">
              <p className="font-bold">
                {(item.default_price.unit_amount / 100).toFixed(2)}
                {item.default_price.currency}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

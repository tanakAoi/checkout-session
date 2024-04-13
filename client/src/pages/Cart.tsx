import { useState } from "react";
import { UserAddressForm } from "../components/UserAddressForm";
import { useCart } from "../contexts/CartContext";
import { ServicePoints } from "../components/ServicePoints";
import { IUserAddress } from "../models/IUserAddress";
import { checkout } from "../utils/checkout";
import { useUser } from "../contexts/UserContext";

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { isLoggedIn, userData } = useUser();
  const [proceedToUserAddress, setProceedToUserAddress] = useState(false);
  const [proceedToServicePoints, setProceedToServicePoints] = useState(false);
  const [proceedToCheckout, setProceedToCheckout] = useState(false);
  const [userAddress, setUserAddress] = useState<IUserAddress>({
    city: "",
    postalCode: "",
    street: {
      streetName: "",
      streetNumber: "",
    },
  });

  const handleProceedToServicePoints = (address: IUserAddress) => {
    if (address) {
      setUserAddress(address);
      setProceedToServicePoints(true);
    }
  };

  const handleProceedToCheckout = () => {
    const checkoutData = {
      cartItems: cart,
      customerId: userData.stripeId,
    };
    checkout(checkoutData);
  };

  return (
    <div className="py-10 flex flex-col justify-center gap-10">
      <h2 className="text-3xl">Your cart</h2>
      {cart.map((product) => (
        <div key={product.product.id} className="flex gap-5">
          <img
            src={product.product.images}
            alt={product.product.name}
            className="max-w-48"
          />
          <div className="flex flex-col justify-between max-w-64">
            <h2 className="font-bold">{product.product.name}</h2>
            <p className="font-bold">
              {(product.product.default_price.unit_amount / 100).toFixed(2)}
              {product.product.default_price.currency}
            </p>
            <div className="flex gap-5">
              <input
                onChange={(e) =>
                  updateQuantity(product.product.id, parseInt(e.target.value))
                }
                className="input w-24 text-lg font-bold"
                type="number"
                min={1}
                name="quantity"
                placeholder="1"
                value={product.quantity}
              />
              <button
                className="btn btn-square btn-outline"
                name="delete"
                onClick={() => removeFromCart(product.product.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
      {cart.length > 0 ? (
        !isLoggedIn && (
          <div
            className="tooltip tooltip-bottom tooltip-warning"
            data-tip="Please log in to proceed"
          >
            <button
              className="btn w-full"
              disabled={!isLoggedIn}
              onClick={() => setProceedToUserAddress(true)}
            >
              Gå vidare
            </button>
          </div>
        )
      ) : (
        <p>Your cart is empty 🥲</p>
      )}
      {proceedToUserAddress && (
        <UserAddressForm
          proceedToServicePoints={handleProceedToServicePoints}
        />
      )}
      {proceedToServicePoints && (
        <ServicePoints
          userAddress={userAddress}
          proceedToCheckout={() => setProceedToCheckout(true)}
        />
      )}
      {proceedToCheckout && (
        <button className="btn w-full" onClick={handleProceedToCheckout}>
          Checkout
        </button>
      )}
    </div>
  );
};

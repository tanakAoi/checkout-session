import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import axios from "axios";
import { IStripeProduct } from "../models/IStripeProduct";
import { UserContext } from "../contexts/UserContext";
import { UserAddress } from "../models/UserAddress";
import { ServicePoint } from "../models/ServicePoint";
import { checkAuth } from "../components/CheckAuth";

export const Cart = () => {
  const [cartItems, setCartItems] = useState<IStripeProduct[]>(
    JSON.parse(localStorage.getItem("cart-items") || "[]")
  );
  const user = useContext(UserContext);
  const [isAddressInputVisible, setIsAddressInputVisible] = useState(false);
  const [userAddress, setUserAddress] = useState<UserAddress>(
    new UserAddress("", "", { streetName: "", streetNumber: "" })
  );
  const [servicePoints, setServicePoints] = useState<ServicePoint[]>([]);
  const [userServicePoint, setUserServicePoint] = useState<ServicePoint>();

  useEffect(() => {
    checkAuth(user);
  }, [user.isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(cartItems));
  }, [cartItems]);

  const changeQuantity = (e: ChangeEvent<HTMLInputElement>, id: string) => {
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

  const deleteItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setUserAddress({ ...userAddress, [e.target.name]: e.target.value });

    if (e.target.name === "street") {
      const street = e.target.value;
      const splitStreet = street.split(" ");
      const streetName = splitStreet.slice(0, -1).join(" ");
      const streetNumber = splitStreet.slice(-1)[0];

      setUserAddress({
        ...userAddress,
        street: { streetName: streetName, streetNumber: streetNumber },
      });
    }
  };

  const getServicePoints = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/postnord/service-points",
        userAddress
      );
      setServicePoints(
        response.data.servicePointInformationResponse.servicePoints
      );
    } catch (error) {
      console.error("Error", error);
    }
  };

  const checkout = async () => {
    localStorage.setItem("service-point", JSON.stringify(userServicePoint));

    const data = {
      cartItems: cartItems,
      customerId: user.userData.stripeId,
    };

    const response = await axios.post(
      "http://localhost:3000/api/stripe/checkout",
      data
    );

    localStorage.setItem("sessionID", JSON.stringify(response.data.id));
    window.location = response.data.url;
  };

  return (
    <div className="py-10 flex flex-col justify-center gap-10">
      <h2 className="text-3xl">Your cart</h2>
      {cartItems.map((item) => (
        <div key={item.id} className="flex gap-5">
          <img src={item.images} alt={item.name} className="max-w-48" />
          <div className="flex flex-col justify-between max-w-64">
            <h2 className="font-bold">{item.name}</h2>
            <p className="font-bold">
              {(item.default_price.unit_amount / 100).toFixed(2)}
              {item.default_price.currency}
            </p>
            <div className="flex gap-5">
              <input
                onChange={(e) => changeQuantity(e, item.id)}
                className="input w-24 text-lg font-bold"
                type="number"
                min={1}
                name="quantity"
                placeholder="1"
                value={item.quantity}
              />
              <button
                className="btn btn-square btn-outline"
                name="delete"
                onClick={() => deleteItem(item.id)}
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

      {cartItems.length > 0 ? (
        <button className="btn" onClick={() => setIsAddressInputVisible(true)}>
          Gå vidare
        </button>
      ) : (
        <p>Your cart is empty 🥲</p>
      )}
      {isAddressInputVisible ? (
        <div>
          <h2>Leverans</h2>
          <form className="flex flex-col gap-2">
            <input className="input" type="text" value={"Sweden"} disabled />
            <input
              className="input"
              type="text"
              onChange={handleAddress}
              name="city"
              id=""
              placeholder="Stad"
              required
            />
            <input
              className="input"
              type="text"
              onChange={handleAddress}
              name="postalCode"
              id=""
              placeholder="Postnummer"
              required
            />
            <input
              className="input"
              type="text"
              onChange={handleAddress}
              name="street"
              id=""
              placeholder="Gata (t.ex. Odengatan 53)"
              required
            />
            <button className="btn" onClick={getServicePoints}>
              Välja utlämningsställe
            </button>
          </form>
          {servicePoints.length > 0 ? (
            <div className="py-10 flex flex-col justify-center items-center gap-5">
              {servicePoints.map((servicePoint) => {
                return (
                  <div
                    key={servicePoint.servicePointId}
                    className={`card w-96 bg-base-100 shadow-xl ${
                      userServicePoint === servicePoint
                        ? "border-4 border-cyan-600"
                        : "border-4 border-transparent"
                    }`}
                  >
                    <div className="card-body">
                      <h3 className="card-title">{servicePoint.name}</h3>
                      <p>
                        {servicePoint.deliveryAddress.streetName}{" "}
                        {servicePoint.deliveryAddress.streetNumber}
                      </p>
                      <p>{servicePoint.deliveryAddress.postalCode}</p>
                      <div className="card-actions justify-end">
                        <button
                          className="btn"
                          onClick={() => setUserServicePoint(servicePoint)}
                        >
                          Choose
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )}
          {userServicePoint ? (
            <button className="btn w-full" onClick={checkout}>
              Checkout
            </button>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import axios from "axios";
import { IProduct } from "../models/IProduct";
import { UserContext } from "../contexts/UserContext";
import { UserAddress } from "../models/UserAddress";
import { ServicePoint } from "../models/ServicePoint";

export const Cart = () => {
  const [cartItems, setCartItems] = useState<IProduct[]>(
    JSON.parse(localStorage.getItem("cart-items") || "[]")
  );
  const userContext = useContext(UserContext);
  const [isAddressInputVisible, setIsAddressInputVisible] = useState(false);
  const [userAddress, setUserAddress] = useState<UserAddress>(
    new UserAddress("", "", { streetName: "", streetNumber: "" })
  );
  const [servicePoints, setServicePoints] = useState<ServicePoint[]>([]);
  const [userServicePoint, setUserServicePoint] = useState<ServicePoint>();

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
      console.log(response.data);
      setServicePoints(
        response.data.servicePointInformationResponse.servicePoints
      );
    } catch (error) {
      console.error("Error", error);
    }
  };

  const checkout = async () => {
    localStorage.setItem("service-point", JSON.stringify(userServicePoint))
    
    const data = {
      cartItems: cartItems,
      customerId: userContext.userData.stripeId,
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
              onChange={(e) => changeQuantity(e, item.id)}
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
              onClick={() => deleteItem(item.id)}
            >
              x
            </button>
          </div>
        </div>
      ))}
    
      <button className="btn" onClick={() => setIsAddressInputVisible(true)}>
        Gå vidare
      </button>
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
            <div className="py-10 flex flex-col justify-center gap-5">
              {servicePoints.map((servicePoint) => {
                return (
                  <div className="card w-96 bg-base-100 shadow-xl">
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
          {userServicePoint ? <button className="btn" onClick={checkout}>Checkout</button> : ""}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

import { useState, ChangeEvent, FormEvent } from "react";
import { IUserAddress } from "../models/IUserAddress";

interface IUserAddressFormProps {
  proceedToServicePoints: (userAddress: IUserAddress) => void;
}

export const UserAddressForm = ({
  proceedToServicePoints,
}: IUserAddressFormProps) => {
  const [userAddress, setUserAddress] = useState<IUserAddress>({
    city: "",
    postalCode: "",
    street: {
      streetName: "",
      streetNumber: "",
    },
  });

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

  const handleClick = (e: FormEvent) => {
    e.preventDefault();
    proceedToServicePoints(userAddress);
  };

  return (
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
        {userAddress && (
          <button className="btn" onClick={handleClick}>
            Välja utlämningsställe
          </button>
        )}
      </form>
    </div>
  );
};

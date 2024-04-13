import axios from "axios";
import { ICartItem } from "../contexts/CartContext";

interface ICheckoutData {
  cartItems: ICartItem[];
  customerId: string;
}

export const checkout = async (checkoutData: ICheckoutData) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/stripe/checkout",
      checkoutData
    );

    localStorage.setItem("sessionID", JSON.stringify(response.data.id));
    window.location = response.data.url;
  } catch (error) {
    console.error("Error: Checkout", error);
  }
};

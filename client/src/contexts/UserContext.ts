import { createContext } from "react";
import { IProduct } from "../models/IProduct";
import { IUser } from "../models/User";

export interface IUserContext {
  isLoggedIn: boolean;
  userData: IUser | null;
  cartItems: IProduct[];
  login: (user: IUser) => void;
  logout: () => void;
  updateCartItems: (items: IProduct[]) => void;
}

export const UserContext = createContext<IUserContext>({
  isLoggedIn: false,
  userData: {
    userName: "",
    email: "",
    password: "",
  },
  cartItems: [],
  login: () => {},
  logout: () => {},
  updateCartItems: () => {}
});

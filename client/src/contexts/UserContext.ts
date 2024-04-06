import { createContext } from "react";
import { IUser } from "../models/User";

export interface IUserContext {
  isLoggedIn: boolean;
  userData: IUser;
  login: (user: IUser) => void;
  logout: () => void;
}

export const UserContext = createContext<IUserContext>({
  isLoggedIn: false,
  userData: {
    stripeId: "",
    userName: "",
    email: "",
    password: "",
  },
  login: () => {},
  logout: () => {},
});

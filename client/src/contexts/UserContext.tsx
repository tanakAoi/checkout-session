import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser } from "../models/IUser";
import axios from "axios";
import { toast } from "react-toastify";

export interface IUserContext {
  isLoggedIn: boolean;
  userData: IUser;
  login: (user: IUser) => void;
  logout: () => void;
  checkAuth: () => void;
}

const initValues = {
  isLoggedIn: false,
  userData: {
    stripeId: "",
    userName: "",
    email: "",
    password: "",
  },
  login: (userData: IUser) => {},
  logout: () => {},
  checkAuth: () => {},
};

const UserContext = createContext<IUserContext>(initValues);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<IUser>(initValues.userData);

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData: IUser) => {
    setIsLoggedIn(true);
    setUserData(userData);
    toast.success("You are logged in!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/logout",
        null,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsLoggedIn(false);
        setUserData(initValues.userData);
        localStorage.setItem("orders", "[]");
        toast.success("You are logged out.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error: any) {
      console.error("Error", error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auth/authorize",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        login(response.data);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        logout();
      }
      console.error("Error", error);
    }
  };

  return (
    <UserContext.Provider
      value={{ isLoggedIn, userData, login, logout, checkAuth }}
    >
      {children}
    </UserContext.Provider>
  );
};

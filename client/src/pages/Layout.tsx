import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { useState } from "react";
import { IUserContext, UserContext } from "../contexts/UserContext";
import { IUser } from "../models/User";
import { IProduct } from "../models/IProduct";

export const Layout = () => {
  const [user, setUser] = useState<IUserContext>({
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

  user.login = (userData: IUser) => {
    setUser({ ...user, isLoggedIn: true, userData: userData });
  };

  user.logout = () => {
    setUser({ ...user, isLoggedIn: false, userData: null });
  };

  user.updateCartItems = (items: IProduct[]) => {
    setUser({...user, cartItems: items})
  }

  return (
    <UserContext.Provider value={user}>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center">
        <Outlet />
      </main>
      <footer></footer>
    </UserContext.Provider>
  );
};

import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useState } from "react";
import { IUserContext, UserContext } from "../contexts/UserContext";
import { IUser } from "../models/User";

export const Layout = () => {
  const [user, setUser] = useState<IUserContext>({
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
  const navigate = useNavigate()

  user.login = (userData: IUser) => {
    setUser({ ...user, isLoggedIn: true, userData: userData });
  };

  user.logout = () => {
    setUser({ ...user, isLoggedIn: false});
    navigate("/")
  };  

  return (
    <UserContext.Provider value={user}>
      <Header />
      <main className="flex flex-col items-center">
        <Outlet />
      </main>
      <footer></footer>
    </UserContext.Provider>
  );
};

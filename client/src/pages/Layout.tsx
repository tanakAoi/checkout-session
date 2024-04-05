import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { useState } from "react";
import { AuthContext, IAuthContext } from "../../contexts/AuthContext";

export const Layout = () => {
  const [auth, setAuth] = useState<IAuthContext>({
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
  });

  auth.login = () => {
    setAuth({ ...auth, isLoggedIn: true });
  };

  auth.logout = () => {
    setAuth({ ...auth, isLoggedIn: false });
  };

  return (
    <AuthContext.Provider value={auth}>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center">
        <Outlet />
      </main>
      <footer></footer>
    </AuthContext.Provider>
  );
};

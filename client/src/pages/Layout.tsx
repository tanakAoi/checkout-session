import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { UserProvider } from "../contexts/UserContext";
import { CartProvider } from "../contexts/CartContext";

export const Layout = () => {

  return (
    <UserProvider>
      <CartProvider>
        <Header />
        <main className="flex flex-col items-center font-sans text-dark bg-coffee">
          <Outlet />
        </main>
        <footer></footer>
      </CartProvider>
    </UserProvider>
  );
};

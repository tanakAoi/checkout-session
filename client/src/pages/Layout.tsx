import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { UserProvider } from "../contexts/UserContext";
import { CartProvider } from "../contexts/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Layout = () => {

  return (
    <UserProvider>
      <CartProvider>
        <ToastContainer />
        <Header />
        <main className="flex flex-col items-center font-sans text-dark bg-coffee">
          <Outlet />
        </main>
        <footer></footer>
      </CartProvider>
    </UserProvider>
  );
};

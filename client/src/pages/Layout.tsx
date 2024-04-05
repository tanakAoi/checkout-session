import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export const Layout = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center">
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
};

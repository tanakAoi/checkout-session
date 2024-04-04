import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <>
      <header></header>
      <main className="min-h-screen flex flex-col items-center justify-center">
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
};

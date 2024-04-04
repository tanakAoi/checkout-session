import { createBrowserRouter } from "react-router-dom";
import { UserRegister } from "./pages/UserRegister";
import { Home } from "./pages/Home";
import { Layout } from "./pages/Layout";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Start } from "./pages/Start";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Start />,
        index: true,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/register",
        element: <UserRegister />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

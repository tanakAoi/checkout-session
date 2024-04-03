import { createBrowserRouter } from "react-router-dom";
import { UserRegister } from "./pages/UserRegister";
import { Home } from "./pages/Home";
import { Layout } from "./pages/Layout";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <NotFound />,
        children: [
            {
                path: "/",
                element: <Home />,
                index: true,
            },
        ]
    },
    {
        path: "/register",
        element: <UserRegister />
    },
    {
        path: "/login",
        element: <Login />
    }
])
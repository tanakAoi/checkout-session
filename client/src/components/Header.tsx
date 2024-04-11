import axios from "axios";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export const Header = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

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
        user.logout();
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error", error);
    }
  };

  return (
    <>
      {user.isLoggedIn ? (
        <header className="w-full h-16 bg-stone-300 px-8 flex items-center justify-between relative">
          <p>
            Logged in as <strong>{user.userData.userName}</strong>
          </p>
          <NavLink
            to={"/home"}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            Cafe Nova
          </NavLink>
          <div className="flex gap-8">
            <NavLink to={"/cart"}>Cart</NavLink>
            <NavLink to={"/order-history"}>Your order</NavLink>
            <button onClick={logout}>Logout</button>
          </div>
        </header>
      ) : (
        ""
      )}
    </>
  );
};

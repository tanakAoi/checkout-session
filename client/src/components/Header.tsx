import axios from "axios";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export const Header = () => {
  const user = useContext(UserContext)
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
    <header className="h-16 bg-stone-300 px-6 flex items-center justify-between">
      <NavLink to={"/home"}>Cafe Nova</NavLink>
      {user.isLoggedIn ? (
        <div className="flex gap-4">
          <button><NavLink to={"/cart"}>Cart</NavLink></button>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        ""
      )}
    </header>
  );
};

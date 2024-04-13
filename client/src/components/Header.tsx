import { NavLink } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export const Header = () => {
  const { isLoggedIn, userData, logout } = useUser();

  return (
    <header className="w-full h-16 px-8 flex items-center justify-between relative bg-main text-light">
      <p>{isLoggedIn ? `Logged in as ${userData.userName}` : ""}</p>
      <NavLink
        to={"/"}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        Cafe Nova
      </NavLink>
      <div className="flex gap-8">
        <NavLink to={"/cart"}>Cart</NavLink>
        <NavLink to={"/order-history"}>Your order</NavLink>
        {isLoggedIn ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button>
            <NavLink to={"/login"}>Login</NavLink>
          </button>
        )}
      </div>
    </header>
  );
};

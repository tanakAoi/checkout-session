import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

export const Header = () => {
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
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error", error);
    }
  };

  return (
    <header className="h-16 bg-stone-300 px-6 flex items-center justify-between">
      <NavLink to={"/home"}>Cafe Nova</NavLink>
      <div className="flex gap-4">
        <button>Cart</button>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
};

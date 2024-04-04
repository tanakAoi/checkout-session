import { NavLink } from "react-router-dom";

export const Start = () => {
  return (
    <>
      <button className="btn">
        <NavLink to={"/login"}>Login</NavLink>
      </button>
      <button className="btn">
        <NavLink to={"/register"}>Register</NavLink>
      </button>
    </>
  );
};

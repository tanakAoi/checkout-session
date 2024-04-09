import { NavLink } from "react-router-dom";

export const Start = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-10">
      <h1 className="text-3xl">Welcome to Cafe Nova!</h1>
      <div className="flex gap-5">
        <button className="btn">
          <NavLink to={"/login"}>Login</NavLink>
        </button>
        <button className="btn">
          <NavLink to={"/register"}>Register</NavLink>
        </button>
      </div>
    </div>
  );
};

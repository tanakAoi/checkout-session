import { NavLink } from "react-router-dom";

export const Login = () => {
  return (
    <div>
      <h2>Login</h2>
      <p>
        New user? Register<NavLink to={"/register"}> here</NavLink>
      </p>
    </div>
  );
};

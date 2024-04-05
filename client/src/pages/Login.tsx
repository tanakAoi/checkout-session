import { ChangeEvent, FormEvent, useState } from "react";
import { User } from "../../models/User";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [user, setUser] = useState<User>(new User("", ""));
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const login = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/login",
          user,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          navigate("/home");
        }
      } catch (error: any) {
        if (error.response.status === 400) {
          const errorMessage = error.response.data.error;
          setErrorMessage(errorMessage);
        } else {
          console.error("Error", error);
        }
      }
    };
    login();
  };

  return (
    <>
      <h2>Login</h2>
      <form action="" onSubmit={handleSubmit}>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="email"
            className="grow"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow"
            name="password"
            placeholder="Password"
            minLength={8}
            maxLength={16}
            required
            onChange={handleChange}
          />
        </label>
        <button className="btn">Login</button>
        {errorMessage ? <span>{errorMessage}</span> : ""}
      </form>
    </>
  );
};

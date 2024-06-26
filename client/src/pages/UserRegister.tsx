import { useState, ChangeEvent, FormEvent } from "react";
import { IUser } from "../models/IUser";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const UserRegister = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState<IUser>({
    stripeId: "",
    userName: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useUser();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const registerAuth = async (userWithId: IUser) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        userWithId,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        login(userWithId);
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error: create a customer on server", error);
      const errorMessage = error.response.data;
      setErrorMessage(errorMessage);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/stripe/create-customer",
        newUser
      );

      if (response.status === 201 && response.data.id) {
        const userWithId = { ...newUser, stripeId: response.data.id };
        setNewUser(userWithId);

        await registerAuth(userWithId);
      }
    } catch (error: any) {
      console.error("Error: create a customer on Stripe", error);
      console.log(error);

      const errorMessage = error.response.data;
      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col justify-center items-center gap-10 bg-[url('images/register-image.jpg')] bg-cover bg-left-top text-dark">
      <h2 className="text-4xl">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            className="grow"
            name="userName"
            value={newUser.userName}
            onChange={handleChange}
            placeholder="Username"
            required
          />
        </label>
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
            value={newUser.email}
            onChange={handleChange}
            placeholder="Email"
            required
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
            value={newUser.password}
            onChange={handleChange}
            placeholder="Password"
            minLength={8}
            maxLength={16}
            required
          />
        </label>
        {errorMessage ? (
          <div
            className="tooltip tooltip-right tooltip-open tooltip-error"
            data-tip={errorMessage}
          >
            <Button children={"Register"} size={"md"} color={"light"} className={"w-full"} />
          </div>
        ) : (
          <Button children={"Register"} size={"md"} color={"light"} className={"w-full"} />
        )}
      </form>
      <p className="bottom-right text-light opacity-80 font-thin">
        Photo by{" "}
        <a href="https://unsplash.com/@heftiba?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
          Toa Heftiba
        </a>{" "}
        on{" "}
        <a href="https://unsplash.com/photos/flat-lay-photography-of-coffee-in-teacup-near-plate-of-sliced-cake-W6sqUYlJRiw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
          Unsplash
        </a>
      </p>
    </div>
  );
};

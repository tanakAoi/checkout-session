import { useState, ChangeEvent, FormEvent } from "react";
import { User } from "../User";

export const UserRegister = () => {
  const [newUser, setNewUser] = useState<User>(new User("", "", ""));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const register = async () => {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      console.log(data);
    };
    register();
  };
  
  return (
    <>
      <h2>Register a new user</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          value={newUser.userName}
          onChange={handleChange}
          placeholder="user name"
        />
        <input
          type="text"
          name="email"
          value={newUser.email}
          onChange={handleChange}
          placeholder="email"
        />
        <input
          type="text"
          name="password"
          value={newUser.password}
          onChange={handleChange}
          placeholder="password"
        />
        <button>register</button>
      </form>
    </>
  );
};

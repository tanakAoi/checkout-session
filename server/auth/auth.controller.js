const { fetchUsers } = require("../services/fetchUsers");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;

const register = async (req, res) => {
  const { userName, email, password } = req.body;

  const users = await fetchUsers();

  const userAlreadyExists = users.find((u) => u.email === email);
  if (userAlreadyExists) {
    return res.status(400).json("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    userName,
    email,
    password: hashedPassword,
  };
  users.push(newUser);
  await fs.writeFile(
    "../server/data/users.json",
    JSON.stringify(users, null, 2)
  );

  res.status(201).json(newUser);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const users = await fetchUsers();
  const existingUser = users.find((u) => u.email === email);
  if (!existingUser) {
    return res.status(400).json({ error: "User not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!isPasswordCorrect) {
    return res.status(400).json({ error: "Wrong password" });
  }

  req.session.user = existingUser;

  res.status(200).json(existingUser.email);
};

const logout = async (req, res) => {
  req.session = null
  res.status(200).json("Successfully logged out")
}

module.exports = { register, login, logout };

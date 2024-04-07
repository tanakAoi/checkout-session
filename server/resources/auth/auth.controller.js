const { fetchUsers } = require("../../services/fetchUsers");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;

const register = async (req, res) => {
  const { stripeId, userName, email, password } = req.body;
  
  const users = await fetchUsers();
  console.log(users);

  const userAlreadyExists = users.find((u) => u.stripeId === stripeId);
  if (userAlreadyExists) {
    return res.status(400).json("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    stripeId,
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

  res.status(200).json(existingUser);
};

const logout = async (req, res) => {
  req.session = null
  res.status(200).json("Successfully logged out")
}

const authorize = async (req, res) => {
  if(!req.session.user) {
    return res.status(401).json("Not logged in")
  }
  res.status(200).json(req.session.user)
}

module.exports = { register, login, logout, authorize };

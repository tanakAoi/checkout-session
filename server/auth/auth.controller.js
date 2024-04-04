const { fetchUsers } = require("../services/fetchUsers");
const bcrypt = require("bcrypt")
const fs = require("fs").promises

const register = async (req, res) => {
  const { userName, email, password } = req.body;

  const users = await fetchUsers();

  const userAlreadyExists = users.find(u => u.email === email && u.userName === userName)
  if(userAlreadyExists) {
    return res.status(400).json("User already exists.")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = {
    userName,
    email,
    password: hashedPassword
  }
  users.push(newUser)
  await fs.writeFile("../server/data/users.json", JSON.stringify(users, null, 2))

  res.status(201).json(newUser)
};

module.exports = { register };

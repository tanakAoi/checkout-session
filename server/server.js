const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./auth/auth.router");
const stripeRouter = require("./stripe/stripe.router");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/stripe", stripeRouter);

app.listen(3000, () => console.log("Server is up and running...💡"));

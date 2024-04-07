const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
require("dotenv").config();

const authRouter = require("./resources/auth/auth.router")
const stripeRouter = require("./resources/stripe/stripe.router");

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(
  cookieSession({
    secret: "2we34fgh",
    maxAge: 1000 * 60 * 60,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/stripe", stripeRouter);

app.listen(3000, () => console.log("Server is up and running...💡"));

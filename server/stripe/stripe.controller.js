const initStripe = require("../stripe");

const createCustomer = async (req, res) => {
  const stripe = initStripe();

  const { userName, email } = req.body;

  const customers = await stripe.customers.list();

  const customerAlreadyExists = customers.data.find((c) => c.email === email);
  if (customerAlreadyExists) {
    return res.status(400).json("Customer already exists.");
  }

  const customer = await stripe.customers.create({
    name: userName,
    email: email,
  });
  res.status(201).json(customer);
};

const fetchProducts = async (req, res) => {
  const stripe = initStripe();

  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });
  res.status(200).json(products);
};

const checkout = async (req, res) => {
  const stripe = initStripe();

  const cartItems = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: cartItems.map((item) => {
      return {
        price: item.default_price.id,
        quantity: item.quantity,
      };
    }),
    success_url: "http://localhost:5173/confirmation",
    cancel_url: "http://localhost:5173/home",
  });
  res.status(200).json({ url: session.url });
};

module.exports = { createCustomer, fetchProducts, checkout };

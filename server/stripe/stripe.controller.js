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
  const stripe = initStripe()

  const products = await stripe.products.list();
  res.status(200).json(products)
};

module.exports = { createCustomer, fetchProducts };

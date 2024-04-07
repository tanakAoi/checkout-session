const initStripe = require("../../stripe");
const fs = require("fs").promises;

const stripe = initStripe();

const createCustomer = async (req, res) => {
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
  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });
  res.status(200).json(products);
};

const checkout = async (req, res) => {
  const { cartItems, customerId, servicePoint } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: cartItems.map((item) => {
      return {
        price: item.default_price.id,
        quantity: item.quantity,
      };
    }),
    allow_promotion_codes: true,
    success_url: "http://localhost:5173/confirmation",
    cancel_url: "http://localhost:5173/home",
  });
  res.status(200).json(session);
};

const validation = async (req, res) => {
  const sessionId = req.body.sessionId;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  
  
  if (session.payment_status === "paid") {
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const servicePoint = JSON.parse(req.body.servicePoint)

    const order = {
      orderNumber: Math.floor(Math.random() * 10000000),
      date: new Date(),
      customerName: session.customer_details.name,
      products: lineItems.data,
      total: session.amount_total,
      shippingAddress: {
        servicePoint: servicePoint.name,
        city: servicePoint.deliveryAddress.city,
        street: servicePoint.deliveryAddress.streetName + servicePoint.deliveryAddress.streetNumber,
        postalCode: servicePoint.deliveryAddress.postalCode
      },
    };

    const orders = JSON.parse(await fs.readFile("./data/orders.json"));
    orders.push(order);
    await fs.writeFile("./data/orders.json", JSON.stringify(orders, null, 5));
  }

  res.status(200).json({ verified: true });
};

module.exports = { createCustomer, fetchProducts, checkout, validation };

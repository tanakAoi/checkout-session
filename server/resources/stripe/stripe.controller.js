const initStripe = require("../../stripe");
const crypto = require("crypto");
const fs = require("fs").promises;

const stripe = initStripe();

const createCustomer = async (req, res) => {
  const { userName, email } = req.body;

  const customers = await stripe.customers.list();

  const customerAlreadyExists = customers.data.find((c) => c.email === email);
  if (customerAlreadyExists) {
    return res.status(400).json("User already exists.");
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
  const { cartItems, customerId } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: cartItems.map((item) => {
      return {
        price: item.product.default_price.id,
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
  const { sessionId, servicePoint } = req.body;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    const parsedServicePoint = JSON.parse(servicePoint);
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    
    const products = await (lineItems.data.map((product) => {
      const productId = product.id;

      return {
        id: productId,
        name: product.description,
        price: product.price.unit_amount / 100,
        currency: product.price.currency,
        quantity: product.quantity,
      };
    }));

    const currentDate = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const orderDate = currentDate.toLocaleString("sv-SE", options);

    const order = {
      orderNumber: "",
      date: orderDate,
      customer: {
        stripeId: session.customer,
        customerName: session.customer_details.name,
      },
      products: products,
      discount: session.total_details.amount_discount / 100,
      total: session.amount_total / 100,
      shippingAddress: {
        servicePoint: parsedServicePoint.name,
        city: parsedServicePoint.deliveryAddress.city,
        street:
          parsedServicePoint.deliveryAddress.streetName +
          parsedServicePoint.deliveryAddress.streetNumber,
        postalCode: parsedServicePoint.deliveryAddress.postalCode,
      },
    };

    const orderString = JSON.stringify(order);
    const hash = crypto.createHash("sha256").update(orderString).digest("hex");
    const orderNumber = hash.slice(0, 10);
    order.orderNumber = orderNumber;

    const ordersData = await fs.readFile("./data/orders.json");
    const orders = JSON.parse(ordersData);
    const existingOrder = orders.find(
      (o) => o.orderNumber === order.orderNumber
    );

    if (!existingOrder) {
      orders.push(order);
      await fs.writeFile("./data/orders.json", JSON.stringify(orders, null, 5));
      res.status(200).json({ verified: true, order });
    } else {
      res.status(400).json({ error: "Order already exists" });
    }
  } else {
    res.status(400).json({ error: "Validation error" });
  }
};

module.exports = { createCustomer, fetchProducts, checkout, validation };

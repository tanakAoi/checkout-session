const fs = require("fs").promises;

const fetchOrders = async (req, res) => {
  const { stripeId } = req.body;

  const ordersData = await fs.readFile("./data/orders.json");
  const orders = JSON.parse(ordersData);

  const userOrders = orders.filter((o) => o.stripeId === stripeId);

  res.status(200).json(userOrders);
};

module.exports = { fetchOrders };

const fs = require("fs").promises;

const fetchOrders = async (req, res) => {
  const { stripeId } = req.body;

  try {
    const ordersData = await fs.readFile("./data/orders.json");
    const orders = JSON.parse(ordersData);
  
    const userOrders = orders.filter((order) => {
      return order.customer.stripeId === stripeId;
    });
  
    res.status(200).json(userOrders);
  } catch (error) {
    console.error("Error", error)
    res.status(400).json("Could not fetch orders.")
  }

};

module.exports = { fetchOrders };

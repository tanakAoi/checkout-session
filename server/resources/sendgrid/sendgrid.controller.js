const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

const sendOrderConfirmation = async (req, res) => {
  const { email, order } = req.body;

  const productDetails = order.products.map((product) => {
    return `
      <p>${product.description}</p>
      <p>${product.price.unit_amount / 100} SEK x ${product.quantity}</p>
      <br>
    `;
  });

  const msg = {
    to: email,
    from: {
      email: "aoitanaka.0523@gmail.com",
      name: "Cafe Nova"
    },
    subject: "Order confirmation",
    html: `
    <h2>Thank you for your order, ${order.customerName}!<h2>
    <h3><strong>Order Details:</strong></h3>
    <p>Order number: ${order.orderNumber}</p>
    <p>Order date: ${order.date}</p>
    <br>
    <p>${productDetails}</p>
    <p><strong>Total Amount:</strong> ${order.total / 100} SEK</p>
    <br>
    <h3><strong>Shipping Address:</strong></h3>
    <p>${order.shippingAddress.servicePoint}</p>
    <p>${order.shippingAddress.postalCode}, ${order.shippingAddress.city}</p>
    <p>${order.shippingAddress.street}</p>
    <br>
    <p>Thank you for shopping with us!</p>
    `,
  };

  try {
    await sgMail.send(msg);
    res
      .status(200)
      .json({ message: "Order confirmation email sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error sending order confirmation email." });
  }
};

module.exports = { sendOrderConfirmation };

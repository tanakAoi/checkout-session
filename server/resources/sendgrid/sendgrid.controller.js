const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

const sendOrderConfirmation = async (req, res) => {
    const {userName, email} = req.body
  const msg = {
    to: email,
    from: "aoitanaka.0523@gmail.com",
    subject: "Order confirmation",
    text: `Thank you for your order, ${userName}!`,
    html: `<strong>Thank you for your order, ${userName}!</strong>`,
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error);
    });

    res.status(200).json(msg)
};

module.exports = { sendOrderConfirmation };

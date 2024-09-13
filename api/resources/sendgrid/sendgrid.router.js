const express = require("express")
const { sendOrderConfirmation } = require("./sendgrid.controller")
const router = express.Router()

router.post("/send-order-confirmation", sendOrderConfirmation)

module.exports = router
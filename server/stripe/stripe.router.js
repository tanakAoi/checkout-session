const express = require("express")
const { createCustomer } = require("./stripe.controller")
const router = express.Router()

router.post("/create-customer", createCustomer)

module.exports = router
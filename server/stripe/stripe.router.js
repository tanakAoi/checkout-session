const express = require("express")
const { createCustomer, fetchProducts } = require("./stripe.controller")
const router = express.Router()

router.post("/create-customer", createCustomer)
router.get("/fetch-products", fetchProducts)

module.exports = router
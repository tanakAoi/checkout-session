const express = require("express")
const { createCustomer, fetchProducts, checkout, validation } = require("./stripe.controller")
const router = express.Router()

router.post("/create-customer", createCustomer)
router.get("/fetch-products", fetchProducts)
router.post("/checkout", checkout)
router.post("/validation", validation)

module.exports = router
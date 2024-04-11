const express = require("express");
const router = express.Router();
const { fetchOrders } = require("../orders/orders.controller");

router.post("/fetch-orders", fetchOrders);

module.exports = router
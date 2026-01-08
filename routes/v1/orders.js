const express = require('express');
const router = express.Router();
const orderController = require("../../controllers/v1/orders");

// [GET] - orders (All products)
router.get('/', orderController.getOrders);

module.exports = router;

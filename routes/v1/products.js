const express = require('express');
const router = express.Router();
const productController = require("../../controllers/v1/products");
const orderController = require("../../controllers/v1/orders");

// ========= Product API ========= //
// [GET] - Products
router.get('/', productController.getProducts);

// [GET] - Product (id)
router.get('/:id', productController.getProductById)

// [POST] - Add product
router.post('/', productController.createProduct);

// [PUT] - Edit product (id)
router.put('/:id', productController.updateProduct);

// [DELETE] - Delete product (id)
router.delete('/:id', productController.deleteProduct);

// ========= Order (Product) API ========= //
// [GET] - Order (Product id)
router.get('/:id/orders', orderController.getOrderByIdProduct);

// [POST] - Add order (Product id)
router.post('/:id/orders', orderController.addOrder);
module.exports = router;

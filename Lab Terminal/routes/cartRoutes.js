const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');

// Route: Get cart
router.get('/cart', cartController.getCart);

// Route: Add to cart
router.post('/cart/add', cartController.addToCart);

// Route: Remove item from cart
router.post('/cart/remove', cartController.removeFromCart);

// Route: Checkout
router.get('/cart/checkout', cartController.getCheckout);
router.post('/cart/checkout', cartController.checkout);

module.exports = router;
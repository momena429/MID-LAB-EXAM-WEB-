const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/OrdersController'); // Adjust the path as needed

// Route: View all orders (for admin panel)
router.get('/', orderController.viewOrders);

// Route: Mark order as completed
router.post('/:id/complete', orderController.completeOrder);

// Route: Cancel an order
router.post('/:id/cancel', orderController.cancelOrder);

// Route: Update order status (for admin panel)
router.post('/:id/status', orderController.updateOrderStatus);

module.exports = router;

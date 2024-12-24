const Order = require('../models/order.model'); // Adjust the path as necessary

// Controller: View all orders
exports.viewOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email');
        res.render('admin/orders', { orders });
    } catch (err) {
        console.error('Error fetching orders:', err);
        req.flash('error', 'Failed to fetch orders!');
        res.redirect('/admin');
    }
};

// Controller: Complete an order
exports.completeOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (order) {
            order.status = 'Completed';
            await order.save();
            req.flash('success', 'Order marked as completed!');
        } else {
            req.flash('error', 'Order not found!');
        }
        res.redirect('/admin/orders');
    } catch (err) {
        console.error('Error completing order:', err);
        req.flash('error', 'Failed to complete order!');
        res.redirect('/admin/orders');
    }
};

// Controller: Cancel an order
exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (order) {
            order.status = 'Cancelled';
            await order.save();
            req.flash('success', 'Order cancelled successfully!');
        } else {
            req.flash('error', 'Order not found!');
        }
        res.redirect('/admin/orders');
    } catch (err) {
        console.error('Error cancelling order:', err);
        req.flash('error', 'Failed to cancel order!');
        res.redirect('/admin/orders');
    }
};

// Controller: Create a new order
// exports.createOrder = async (req, res) => {
//     try {
//         const { items, total, userId, shippingAddress, payment } = req.body;

//         // Validate incoming order data
//         if (!items || !Array.isArray(items) || items.length === 0 || !total || !userId || !shippingAddress || !payment) {
//             return res.status(400).json({ success: false, message: 'Invalid order data.' });
//         }

//         const newOrder = new Order({
//             userId,
//             items,
//             total,
//             status: 'Pending',
//             shippingAddress,
//             payment,
//         });

//         await newOrder.save();
//         res.status(201).json({ success: true, message: 'Order placed successfully.' });
//     } catch (error) {
//         console.error('Error placing order:', error);
//         res.status(500).json({ success: false, message: 'Failed to place order.' });
//     }
// };

// Controller: Update order status
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status update.' });
    }

    try {
        const order = await Order.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        req.flash('success', `Order #${id} status updated to ${status}`);
        res.redirect('/admin/orders');
    } catch (err) {
        console.error('Error updating order status:', err);
        req.flash('error', 'Unable to update order status');
        res.redirect('/admin/orders');
    }
};

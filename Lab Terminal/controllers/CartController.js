const Order = require('../models/order.model');
const Product = require('../models/product.model'); // Assuming you have a product model to check stock

// Get the cart
exports.getCart = (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render('admin/cart', { cart, total });
};

// Add item to cart
exports.addToCart = (req, res) => {
  const { id, title, price, quantity } = req.body;

  if (!req.session.cart) {
    req.session.cart = [];
  }

  // Check if the item already exists in the cart
  const existingItemIndex = req.session.cart.findIndex(item => item.productId === id);
  if (existingItemIndex > -1) {
    req.session.cart[existingItemIndex].quantity += Number(quantity);
  } else {
    req.session.cart.push({
      productId: id,
      title,
      price: Number(price),
      quantity: Number(quantity),
    });
  }

  req.flash('success', `${title} added to cart.`);
  res.redirect('/cart');
};

// Remove item from cart
exports.removeFromCart = (req, res) => {
  const { id } = req.body;

  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(item => item.productId !== id);
  }

  req.flash('success', 'Item removed from cart.');
  res.redirect('/cart');
};

// Checkout process
exports.checkout = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    console.log('Cart:', cart); // Log the cart items
    const userId = req.user?._id;
    console.log('User ID:', userId); // Log the user ID
    
    // Check if the user is logged in
    if (!userId) {
      req.flash('error', 'You must be logged in to checkout.');
      return res.redirect('/login');
    }

    // Check if the cart is empty
    if (cart.length === 0) {
      req.flash('error', 'Your cart is empty.');
      return res.redirect('/cart');
    }

    const { paymentMethod, shippingAddress } = req.body;
    console.log('Payment Method:', paymentMethod); // Log the payment method
    console.log('Shipping Address:', shippingAddress); // Log the shipping address

    // Validate required fields for checkout
    if (!paymentMethod || !['Credit Card', 'Debit Card', 'Cash On Delivery'].includes(paymentMethod)) {
      req.flash('error', 'Invalid payment method.');
      return res.redirect('/cart');
    }

    if (!shippingAddress || !shippingAddress.country || !shippingAddress.postalCode || 
        !shippingAddress.city || !shippingAddress.street) {
      req.flash('error', 'Shipping address is incomplete.');
      return res.redirect('/cart');
    }

    // Validate stock availability for each item in the cart
    for (let item of cart) {
      const product = await Product.findById(item.productId);
      if (!product) {
        req.flash('error', `Product with ID ${item.productId} not found.`);
        return res.redirect('/cart');
      }

      if (product.stock < item.quantity) {
        req.flash('error', `${item.title} is out of stock.`);
        return res.redirect('/cart');
      }
    }

    // Calculate total price
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log('Total Price:', total); // Log the total price

    // Prepare order items array
    const items = cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    // Save the order
    const newOrder = new Order({
      userId,
      items,
      total,
      status: 'Pending',
      payment: {
        method: paymentMethod,
        status: 'Pending',
      },
      shippingAddress,
      orderHistory: [{
        status: 'Pending',
        comment: 'Order placed, waiting for confirmation.',
        updatedAt: Date.now(),
      }],
    });

    await newOrder.save();
    console.log('New Order Saved:', newOrder); // Log the saved order

    // Clear cart
    req.session.cart = [];
    req.flash('success', 'Order placed successfully!');
    res.redirect('/orders');
  } catch (error) {
    console.error('Error during checkout:', error);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/cart');
  }
};

// Get checkout page with cart details
exports.getCheckout = (req, res) => {
  try {
    const cart = req.session.cart || [];

    if (cart.length === 0) {
      req.flash('error', 'Your cart is empty.');
      return res.redirect('/cart');
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.render('admin/checkout', { cart, total });
  } catch (error) {
    console.error('Error rendering checkout page:', error);
    req.flash('error', 'Failed to load the checkout page.');
    res.redirect('/cart');
  }
};

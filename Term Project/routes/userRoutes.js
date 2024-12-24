const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Replace with your actual path
const Product = require('../models/Product'); // Replace with your actual path
const { isAuthenticated } = require('../middleware/auth'); // Middleware to check login

// Add to Wishlist
router.post('/wishlist/add/:productId', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming `req.user` contains the logged-in user
    const productId = req.params.productId;

    const user = await User.findById(userId);

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
      res.status(200).json({ message: 'Product added to wishlist.' });
    } else {
      res.status(400).json({ message: 'Product already in wishlist.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get Wishlist
router.get('/wishlist', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.render('wishlist', { wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;

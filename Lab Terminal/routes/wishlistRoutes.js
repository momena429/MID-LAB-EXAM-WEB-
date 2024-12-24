const express = require('express');
const router = express.Router();

// const Wishlist = require('../models/wishlist.model'); // Import the Wishlist model
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Wishlist = require('../models/wishlist.model');  // Adjust the path if necessary

const { isAuthenticated } = require('../middlewares/authorization');

// Add to Wishlist
router.post('/wishlist', isAuthenticated, async (req, res) => {
    const userId = req.user.id; // Assuming user is logged in
    const productId = req.params.productId;

    try {
        // Check if the product is already in the wishlist
        const existingWishlistItem = await Wishlist.findOne({ user_id: userId, product_id: productId });

        if (existingWishlistItem) {
            return res.status(400).json({ message: 'Product already in wishlist.' });
        }

        // Add product to wishlist
        const newWishlistItem = new Wishlist({
            user_id: userId,
            product_id: productId
        });

        await newWishlistItem.save();

        res.status(200).json({ message: 'Product added to wishlist successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product to wishlist.' });
    }
});

// Get Wishlist for Logged-in User
router.get('/wishlist', isAuthenticated, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate('wishlist');
        const wishlistItems = user.wishlist;

        res.status(200).json({ wishlist: wishlistItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving wishlist.' });
    }
});

module.exports = router;

const mongoose = require('mongoose');

// Define the Wishlist Schema
const wishlistSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }]
}, { timestamps: true });

// Create a model for the Wishlist
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;

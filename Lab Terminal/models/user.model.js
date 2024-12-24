const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define user schema with wishlist
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },  // Admin flag
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]  // Wishlist
});

// Add comparePassword method to userSchema
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export User model
const User = mongoose.model("User", userSchema);
module.exports = User;


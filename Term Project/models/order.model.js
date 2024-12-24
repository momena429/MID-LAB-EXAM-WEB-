const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number},
      }
    ],
    total: { type: Number, required: true },  // Total order price
    status: { 
      type: String, 
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], 
      default: 'Pending' 
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    payment: {
      method: { type: String, enum: ['Credit Card', 'Debit Card', 'Cash On Delivery'], required: true },
      status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }
    },
    shippingStatus: { 
      type: String, 
      enum: ['Pending', 'Shipped', 'Delivered'], 
      default: 'Pending' 
    },
    estimatedDelivery: { type: Date },  // Estimated delivery date
    orderHistory: [
      {
        status: { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] },
        updatedAt: { type: Date, default: Date.now },
        comment: { type: String }
      }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

orderSchema.pre('save', function(next) {
  // Update the updatedAt field to the current date before saving
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);


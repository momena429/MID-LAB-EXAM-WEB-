const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
});

module.exports = mongoose.model('Category', categorySchema);

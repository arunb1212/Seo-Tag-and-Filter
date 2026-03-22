const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ai_output: {
    type: Object,
    required: true
  },
  prompt: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

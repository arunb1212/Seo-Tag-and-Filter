const { generateTagsAndCategory } = require('../services/aiService');
const Product = require('../models/Product');

const generateTags = async (req, res) => {
  try {
    const { product_name, description } = req.body;

    if (!product_name || !description) {
      return res.status(400).json({ error: 'Product name and description are required' });
    }

    const aiResult = await generateTagsAndCategory(product_name, description);
    
    const newProduct = new Product({
      product_name,
      description,
      ai_output: aiResult.data,
      prompt: aiResult.prompt
    });

    await newProduct.save();

    res.status(200).json(aiResult.data);
  } catch (error) {
    console.error('Error in generateTags:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

module.exports = { generateTags };

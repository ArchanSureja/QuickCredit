const LoanProduct = require('../models/LoanProduct');

// Create loan product
exports.createLoanProduct = async (req, res) => {
  try {
    const product = new LoanProduct({
      ...req.body,
      admin_id: req.admin.id
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all loan products
exports.getLoanProducts = async (req, res) => {
  try {
    const products = await LoanProduct.find({ admin_id: req.admin.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update loan product
exports.updateLoanProduct = async (req, res) => {
  try {
    const product = await LoanProduct.findOneAndUpdate(
      { _id: req.params.id, admin_id: req.admin.id },
      req.body,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete loan product
exports.deleteLoanProduct = async (req, res) => {
  try {
    const product = await LoanProduct.findOneAndDelete({
      _id: req.params.id,
      admin_id: req.admin.id
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
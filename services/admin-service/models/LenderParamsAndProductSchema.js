const mongoose = require('mongoose');

const LenderParamsAndProductSchema = new mongoose.Schema({
  admin_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: true 
  },
  loan_product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanProduct',
    required: true,
    // unique: true
  },
  Business_age: {
    type: Number,
    required: true,
    comment: 'Minimum business age in months'
  },
  is_GST: {
    type: Boolean,
    required: true,
    default: false
  },
  min_maintained_balance: {
    type: Number,
    required: true
  },
  max_outflow_ratio: {
    type: Number,
    required: true,
    comment: 'Max allowed outflow/inflow ratio'
  },
  min_monthly_inflow: {
    type: Number,
    required: true
  },
  min_recommended_limit: {
    type: Number,
    required: true
  },
  max_recommended_limit: {
    type: Number,
    required: true
  },
  mix_category: {
    type: String,
    enum: ['retail', 'wholesale', 'manufacturing', 'service', 'mixed'],
    required: true
  },
  min_credit_score: {
    type: Number,
    required: true,
    min: 300,
    max: 900
  },
  max_credit_score: {
    type: Number,
    required: true,
    min: 300,
    max: 900
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
LenderParamsAndProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('LenderParamsAndProduct', LenderParamsAndProductSchema);
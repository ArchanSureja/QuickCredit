const mongoose = require('mongoose');

const LoanApplicationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loan_product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanProduct', required: true },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  applied: { type: Date, default: Date.now },
  limit: { type: Number, required: true },
  tenure_months: { type: Number, required: true },
  application_status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected', 'disbursed'] },
  main_matched_rules: { type: mongoose.Schema.Types.Mixed },
  call_tracking_logs: { type: String },
  disbursement: { type: Boolean, default: false },
  contract_id: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema);
const mongoose = require('mongoose');

const LoanProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    loan_type: { type: String, required: true },
    target_segment: { type: String },
    min_tenure_months: { type: Number, required: true },
    max_tenure_months: { type: Number, required: true },
    min_amount: { type: Number, required: true },
    max_amount: { type: Number, required: true },
    interest_rate: { type: Number, required: true },
    processing_fee_percent: { type: Number },
    prepayment_penalty: { type: Number },
    late_payment_fee: { type: Number },
    prepayment_frequency: { type: String },
    grace_period_days: { type: Number },
    required_documents: { type: [String] },
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoanProduct', LoanProductSchema);
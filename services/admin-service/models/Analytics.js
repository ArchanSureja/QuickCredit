const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    average_monthly_inflow: { type: Number, required: true },
    average_monthly_outflow: { type: Number, required: true },
    cash_flow_stability: { type: Number, required: true }, // could be a score 1-100
    min_maintained_balance: { type: Number, required: true },
    max_debit_credit_spikes: { type: Number, required: true },
    transaction_frequency: { type: Number, required: true }, // transactions per month
    upt_percentage: { type: Number, required: true }, // uptime percentage
    loan_repayment_patterns: { type: String, enum: ['consistent', 'irregular', 'delayed'], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
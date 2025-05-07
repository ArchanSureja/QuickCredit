const mongoose = require('mongoose');

const LoanEligibilitySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lender_params_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LenderParamsAndProduct',
        required: true
    },
    eligible_products: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LoanProduct'
        },
        max_eligible_amount: Number,
        recommended_tenure: Number
    }],
    checked_at: {
        type: Date,
        default: Date.now
    },
    expires_at: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days validity
    }
});

module.exports = mongoose.model('LoanEligibility', LoanEligibilitySchema);
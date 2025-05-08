const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
    app_url: { type: String },
    generated_at: { type: Date, default: Date.now },
    signed_by_user: { type: Boolean, default: false },
    signed_by_lender: { type: Boolean, default: false },
    esign_status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending' },
    esign_label: { type: String }
});

module.exports = mongoose.model('Contract', ContractSchema);
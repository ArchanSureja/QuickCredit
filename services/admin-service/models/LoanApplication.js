const mongoose = require('mongoose');

const LoanApplicationSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  loan_product_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'LoanProduct', 
    required: true 
  },
  admin_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: true 
  },
  applied: { 
    type: Date, 
    default: Date.now 
  },
  limit: { 
    type: Number, 
    required: true 
  },
  tenure_months: { 
    type: Number, 
    required: true 
  },
  application_status: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'approved', 'rejected', 'disbursed'] 
  },
  main_matched_rules: { 
    type: mongoose.Schema.Types.Mixed 
  },
  call_tracking_logs: { 
    type: String 
  },
  disbursement: { 
    type: Boolean, 
    default: false 
  },
  contract_id: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  eligibility_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'LoanEligibility' 
  },
  processed_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin' 
  },
  processed_at: { 
    type: Date 
  },
  disbursed_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin' 
  },
  disbursed_at: { 
    type: Date 
  },
  rejection_reason: { 
    type: String 
  }
});

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema);
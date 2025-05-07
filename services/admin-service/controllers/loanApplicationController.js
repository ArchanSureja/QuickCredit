const LoanApplication = require('../models/LoanApplication');
const LoanProduct = require('../models/LoanProduct');
const Admin = require('../models/Admin');

// Create new loan application
exports.createLoanApplication = async (req, res) => {
  try {
    const { user_id, loan_product_id, limit, tenure_months } = req.body;
    
    // Verify loan product exists
    const product = await LoanProduct.findById(loan_product_id);
    if (!product) {
      return res.status(404).json({ message: 'Loan product not found' });
    }

    // Create application
    const application = new LoanApplication({
      user_id,
      loan_product_id,
      admin_id: req.admin.id,
      limit,
      tenure_months,
      main_matched_rules: {
        credit_score_match: true,
        business_age_match: true
      }
    });

    await application.save();
    
    // Populate references in response
    const populatedApp = await LoanApplication.findById(application._id)
      .populate('loan_product_id', 'name interest_rate')
      .populate('admin_id', 'name institute_name');

    res.status(201).json(populatedApp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all loan applications (admin view)
exports.getLoanApplications = async (req, res) => {
  try {
    const applications = await LoanApplication.find({ admin_id: req.admin.id })
      .populate('user_id', 'name email')
      .populate('loan_product_id', 'name interest_rate')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single application
exports.getLoanApplication = async (req, res) => {
  try {
    const application = await LoanApplication.findOne({
      _id: req.params.id,
      admin_id: req.admin.id
    })
    .populate('user_id')
    .populate('loan_product_id')
    .populate('admin_id');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const application = await LoanApplication.findOneAndUpdate(
      { 
        _id: req.params.id, 
        admin_id: req.admin.id 
      },
      { 
        application_status: status,
        ...(status === 'disbursed' && { disbursement: true }) 
      },
      { new: true }
    )
    .populate('user_id', 'name email')
    .populate('loan_product_id', 'name');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add call log to application
exports.addCallLog = async (req, res) => {
  try {
    const { notes } = req.body;
    
    const application = await LoanApplication.findOneAndUpdate(
      { 
        _id: req.params.id, 
        admin_id: req.admin.id 
      },
      { 
        $push: { 
          call_tracking_logs: {
            date: new Date(),
            admin: req.admin.id,
            notes
          }
        } 
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const LenderParamsAndProduct = require('../models/LenderParamsAndProduct');

// Create lender parameters
exports.createLenderParams = async (req, res) => {
  try {
    const params = new LenderParamsAndProduct({
      ...req.body,
      admin_id: req.admin.id
    });

    await params.save();
    res.status(201).json(params);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Loan product ID already exists' });
    }
    res.status(400).json({ message: err.message });
  }
};

// Get all lender parameters for admin
exports.getAllLenderParams = async (req, res) => {
  try {
    const params = await LenderParamsAndProduct.find({ admin_id: req.admin.id })
      .sort({ createdAt: -1 });
      
    res.json(params);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single lender parameter set
exports.getLenderParams = async (req, res) => {
  try {
    const params = await LenderParamsAndProduct.findOne({
      _id: req.params.id,
      admin_id: req.admin.id
    });

    if (!params) {
      return res.status(404).json({ message: 'Parameters not found' });
    }

    res.json(params);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update lender parameters
exports.updateLenderParams = async (req, res) => {
  try {
    const params = await LenderParamsAndProduct.findOneAndUpdate(
      { 
        _id: req.params.id,
        admin_id: req.admin.id 
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!params) {
      return res.status(404).json({ message: 'Parameters not found' });
    }

    res.json(params);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete lender parameters
exports.deleteLenderParams = async (req, res) => {
  try {
    const params = await LenderParamsAndProduct.findOneAndDelete({
      _id: req.params.id,
      admin_id: req.admin.id
    });

    if (!params) {
      return res.status(404).json({ message: 'Parameters not found' });
    }

    res.json({ message: 'Parameters deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check eligibility against parameters
exports.checkEligibility = async (req, res) => {
  try {
    const { 
      businessAge, 
      hasGST, 
      currentBalance, 
      monthlyInflow, 
      creditScore 
    } = req.body;

    const params = await LenderParamsAndProduct.findById(req.params.id);

    if (!params) {
      return res.status(404).json({ message: 'Parameters not found' });
    }

    const eligibility = {
      businessAge: businessAge >= params.Business_age,
      gst: hasGST === params.is_GST,
      balance: currentBalance >= params.min_maintained_balance,
      inflow: monthlyInflow >= params.min_monthly_inflow,
      creditScore: creditScore >= params.min_credit_score && 
                  creditScore <= params.max_credit_score,
      allPassed: false
    };

    eligibility.allPassed = Object.values(eligibility)
      .slice(0, -1)
      .every(val => val === true);

    res.json({
      eligibility,
      recommendedLimit: eligibility.allPassed ? {
        min: params.min_recommended_limit,
        max: params.max_recommended_limit
      } : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
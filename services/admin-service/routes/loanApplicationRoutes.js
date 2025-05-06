const express = require('express');
const router = express.Router();
const loanApplicationController = require('../controllers/loanApplicationController');
const auth = require('../middlewares/auth');

// Create new application
router.post('/create', auth.protect, loanApplicationController.createLoanApplication);

// Get all applications
router.get('/', auth.protect, loanApplicationController.getLoanApplications);

// Get single application
router.get('/:id', auth.protect, loanApplicationController.getLoanApplication);

// Update application status
router.put('/:id/status', auth.protect, loanApplicationController.updateApplicationStatus);

// Add call log
router.post('/:id/call-log', auth.protect, loanApplicationController.addCallLog);

module.exports = router;
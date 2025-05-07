const express = require('express');
const router = express.Router();
const adminLoanController = require('../controllers/adminLoanController');
const auth = require('../middlewares/auth');

// Admin routes
router.get('/requests', auth.protect, adminLoanController.getLoanRequests);
router.put('/requests/:id/process', auth.protect, adminLoanController.processApplication);
router.put('/requests/:id/disburse', auth.protect, adminLoanController.disburseLoan);

module.exports = router;
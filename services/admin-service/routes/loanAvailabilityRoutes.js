const express = require('express');
const router = express.Router();
const loanAvailabilityController = require('../controllers/loanAvailabilityController');
const auth = require('../middlewares/user-auth');

// User routes
router.post('/check-availability', auth.protect, loanAvailabilityController.checkAvailableLoans);
router.post('/apply', auth.protect, loanAvailabilityController.applyForLoan);

module.exports = router;
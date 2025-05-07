const express = require('express');
const router = express.Router();
const lenderParamsController = require('../controllers/lenderParamsController');
const auth = require('../middlewares/auth');

// Create parameters
router.post('/', auth.protect, lenderParamsController.createLenderParams);

// Get all parameters
router.get('/', auth.protect, lenderParamsController.getAllLenderParams);

// Get single parameter set
router.get('/:id', auth.protect, lenderParamsController.getLenderParams);

// Update parameters
router.put('/:id', auth.protect, lenderParamsController.updateLenderParams);

// Delete parameters
router.delete('/:id', auth.protect, lenderParamsController.deleteLenderParams);

// Check eligibility
router.post('/:id/check-eligibility', auth.protect, lenderParamsController.checkEligibility);

module.exports = router;
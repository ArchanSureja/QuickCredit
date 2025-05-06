const express = require('express');
const router = express.Router();
const loanProductController = require('../controllers/loanProductController');
const auth = require('../middlewares/auth');

router.post('/create', auth.protect, loanProductController.createLoanProduct);
router.get('/', auth.protect, loanProductController.getLoanProducts);
router.put('/:id', auth.protect, loanProductController.updateLoanProduct);
router.delete('/:id', auth.protect, loanProductController.deleteLoanProduct);

module.exports = router;
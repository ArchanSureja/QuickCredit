const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');

router.post('/', contractController.createContract);
router.get('/:id', contractController.getContractById);
router.put('/:id', contractController.updateContract);

module.exports = router;
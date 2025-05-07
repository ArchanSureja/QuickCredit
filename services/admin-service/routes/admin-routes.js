const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin-controller');
const auth = require('../middlewares/auth');

router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.get('/profile', auth.protect, adminController.getProfile);

module.exports = router;
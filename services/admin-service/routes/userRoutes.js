const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/user-auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.get('/profile', auth.protect, userController.getProfile);
router.put('/profile', auth.protect, userController.updateProfile);
router.delete('/account', auth.protect, userController.deleteAccount);

module.exports = router;
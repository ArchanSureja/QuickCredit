const express = require('express');
const router = express.Router();
const analyticsController = require('../../admin-service/controllers/analyticsController');

router.post('/', analyticsController.createAnalytics);
router.get('/user/:userId', analyticsController.getAnalyticsByUserId);
router.put('/:id', analyticsController.updateAnalytics);

module.exports = router;
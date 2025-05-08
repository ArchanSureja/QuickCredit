const Analytics = require('../models/Analytics');

// Create analytics record
exports.createAnalytics = async (req, res) => {
    try {
        const analytics = new Analytics(req.body);
        await analytics.save();
        res.status(201).json(analytics);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get analytics by user ID
exports.getAnalyticsByUserId = async (req, res) => {
    try {
        const analyticsData = await Analytics.findOne({ user_id: req.params.userId });
        if (!analyticsData) {
            return res.status(404).json({ message: 'Analytics data not found' });
        }
        res.json(analyticsData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update analytics
exports.updateAnalytics = async (req, res) => {
    try {
        const updatedData = await Analytics.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
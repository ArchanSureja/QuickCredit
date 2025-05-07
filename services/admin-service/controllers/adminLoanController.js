const LoanApplication = require('../models/LoanApplication');

// Get all loan requests for admin
exports.getLoanRequests = async (req, res) => {
    try {
        const { status } = req.query;

        const query = { admin_id: req.admin.id };
        if (status) query.application_status = status;

        const applications = await LoanApplication.find(query)
            .populate('user_id', 'name email')
            .populate('loan_product_id', 'name interest_rate')
            .sort({ applied: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Process loan application (approve/reject)
exports.processApplication = async (req, res) => {
    try {
        const { action } = req.body; // 'approve' or 'reject'

        const application = await LoanApplication.findOneAndUpdate(
            {
                _id: req.params.id,
                admin_id: req.admin.id,
                application_status: 'pending' // Only process pending applications
            },
            {
                application_status: action === 'approve' ? 'approved' : 'rejected',
                processed_by: req.admin.id,
                processed_at: new Date()
            },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found or already processed' });
        }

        // TODO: Send notification to user

        res.json(application);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Disburse approved loan
exports.disburseLoan = async (req, res) => {
    try {
        const application = await LoanApplication.findOneAndUpdate(
            {
                _id: req.params.id,
                admin_id: req.admin.id,
                application_status: 'approved' // Only disburse approved loans
            },
            {
                application_status: 'disbursed',
                disbursement: true,
                disbursed_by: req.admin.id,
                disbursed_at: new Date()
            },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found or not approved' });
        }

        // TODO: Initiate fund transfer and send notification

        res.json(application);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
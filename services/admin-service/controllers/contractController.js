const Contract = require('../models/Contract');

// Create contract
exports.createContract = async (req, res) => {
    try {
        const { app_url, esign_label } = req.body;
        const contract = new Contract({
            app_url,
            esign_label
        });
        await contract.save();
        res.status(201).json(contract);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get contract by ID
exports.getContractById = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }
        res.json(contract);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update contract (e.g., for signing)
exports.updateContract = async (req, res) => {
    try {
        const updatedContract = await Contract.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedContract);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

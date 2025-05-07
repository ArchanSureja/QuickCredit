const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Register new admin
exports.register = async (req, res) => {
    try {
        const { name, email, institute_name, password, admin_id, institute } = req.body;

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = new Admin({
            name,
            email,
            institute_name,
            password,
            admin_id,
            institute
        });

        await admin.save();

        // Create token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            institute_name: admin.institute_name,
            token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login admin
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            institute_name: admin.institute_name,
            token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get admin profile
exports.getProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
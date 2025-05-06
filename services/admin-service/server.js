const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', require('./routes/admin-routes'));
app.use('/api/loan-products', require('./routes/loanProductRoutes'));
app.use('/api/loan-applications', require('./routes/loanApplicationRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
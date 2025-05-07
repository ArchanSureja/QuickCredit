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
app.use('/api/lender-params', require('./routes/lenderParamsRoutes'));
app.use('/api/loans', require('./routes/loanAvailabilityRoutes'));
app.use('/api/admin/loans', require('./routes/adminLoanRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
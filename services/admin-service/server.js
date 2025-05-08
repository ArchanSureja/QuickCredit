const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const analyticsRoutes = require('./routes/analyticsRoutes');
const contractRoutes = require('./routes/contractRoutes');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-frontend-domain.com'] 
      : ['http://localhost:3000', 'http://localhost:8080' , 'http://localhost:8081' ], // Common React dev ports
    credentials: true, // Allow cookies to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/admin', require('./routes/admin-routes'));
app.use('/api/loan-products', require('./routes/loanProductRoutes'));
app.use('/api/loan-applications', require('./routes/loanApplicationRoutes'));
app.use('/api/lender-params', require('./routes/lenderParamsRoutes'));
app.use('/api/loans', require('./routes/loanAvailabilityRoutes'));
app.use('/api/admin/loans', require('./routes/adminLoanRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/analytics', analyticsRoutes);
app.use('/api/contracts', contractRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
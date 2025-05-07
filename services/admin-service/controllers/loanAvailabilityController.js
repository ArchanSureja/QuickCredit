const LoanProduct = require('../models/LoanProduct');
const LenderParamsAndProduct = require('../models/LenderParamsAndProductSchema');
const LoanEligibility = require('../models/LoanEligibility');
const LoanApplication = require('../models/LoanApplication');

// Check available loans for user
// exports.checkAvailableLoans = async (req, res) => {
//     try {
//         const {
//             businessAge,
//             hasGST,
//             currentBalance,
//             avgMonthlyInflow,
//             creditScore,
//             requestedAmount,
//             preferredTenure
//         } = req.body;

//         // 1. Get all lender parameters that match basic criteria
//         const matchingParams = await LenderParamsAndProduct.find({
//             Business_age: { $lte: businessAge },
//             is_GST: hasGST,
//             min_maintained_balance: { $lte: currentBalance },
//             min_monthly_inflow: { $lte: avgMonthlyInflow },
//             min_credit_score: { $lte: creditScore },
//             max_credit_score: { $gte: creditScore }
//         });

//         // 2. Find products matching these parameters
//         const lenderParamIds = matchingParams.map(p => p._id);
//         const eligibleProducts = await LoanProduct.find({
//             admin_id: { $in: matchingParams.map(p => p.admin_id) }
//         }).populate('admin_id', 'institute_name');

//         // 3. Calculate eligible amounts for each product
//         const productsWithEligibility = eligibleProducts.map(product => {
//             const params = matchingParams.find(p =>
//                 p.admin_id.toString() === product.admin_id._id.toString()
//             );

//             const maxEligible = Math.min(
//                 params.max_recommended_limit,
//                 requestedAmount || params.max_recommended_limit
//             );

//             return {
//                 product: product,
//                 max_eligible_amount: maxEligible,
//                 recommended_tenure: preferredTenure ||
//                     Math.min(product.max_tenure_months, 36) // Default to 36 months if not specified
//             };
//         });

//         // 4. Save eligibility result
//         const eligibilityRecord = new LoanEligibility({
//             user_id: req.user.id,
//             lender_params_id: matchingParams[0]._id, // Save first matching params
//             eligible_products: productsWithEligibility.map(p => ({
//                 product_id: p.product._id,
//                 max_eligible_amount: p.max_eligible_amount,
//                 recommended_tenure: p.recommended_tenure
//             }))
//         });
//         await eligibilityRecord.save();

//         res.json({
//             eligible_products: productsWithEligibility,
//             eligibility_id: eligibilityRecord._id
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

exports.checkAvailableLoans = async (req, res) => {
    try {
        const {
            businessAge,
            hasGST,
            currentBalance,
            avgMonthlyInflow,
            creditScore,
            requestedAmount,
            preferredTenure
        } = req.body;

        // 1. Get all lender parameters that match basic criteria
        const matchingParams = await LenderParamsAndProduct.find({
            Business_age: { $lte: businessAge },
            is_GST: hasGST,
            min_maintained_balance: { $lte: currentBalance },
            min_monthly_inflow: { $lte: avgMonthlyInflow },
            min_credit_score: { $lte: creditScore },
            max_credit_score: { $gte: creditScore }
        });

        // Return empty array if no matching parameters found
        if (matchingParams.length === 0) {
            return res.json({
                eligible_products: [],
                message: "No matching loan products found based on your criteria"
            });
        }

        // 2. Find products matching these parameters
        const eligibleProducts = await LoanProduct.find({
            admin_id: { $in: matchingParams.map(p => p.admin_id) }
        }).populate('admin_id', 'institute_name');

        // Return empty array if no products found
        if (eligibleProducts.length === 0) {
            return res.json({
                eligible_products: [],
                message: "No loan products available for your profile"
            });
        }

        // 3. Calculate eligible amounts for each product
        const productsWithEligibility = eligibleProducts.map(product => {
            const params = matchingParams.find(p =>
                p.admin_id.toString() === product.admin_id._id.toString()
            );

            // Skip if no matching params found (shouldn't happen due to query)
            if (!params) return null;

            const maxEligible = Math.min(
                params.max_recommended_limit,
                requestedAmount || params.max_recommended_limit
            );

            return {
                product: product,
                max_eligible_amount: maxEligible,
                recommended_tenure: preferredTenure ||
                    Math.min(product.max_tenure_months, 36)
            };
        }).filter(Boolean); // Remove any null entries

        // 4. Save eligibility result only if products found
        let eligibilityRecord;
        if (productsWithEligibility.length > 0) {
            eligibilityRecord = new LoanEligibility({
                user_id: req.user.id,
                lender_params_id: matchingParams[0]._id,
                eligible_products: productsWithEligibility.map(p => ({
                    product_id: p.product._id,
                    max_eligible_amount: p.max_eligible_amount,
                    recommended_tenure: p.recommended_tenure
                }))
            });
            await eligibilityRecord.save();
        }

        res.json({
            eligible_products: productsWithEligibility,
            eligibility_id: eligibilityRecord?._id,
            message: productsWithEligibility.length > 0 
                ? "Loan options found" 
                : "No matching loan products available"
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Error checking loan availability",
            error: err.message 
        });
    }
};

// Apply for a loan
exports.applyForLoan = async (req, res) => {
    try {
        const {
            product_id,
            amount,
            tenure_months,
            eligibility_id
        } = req.body;

        // Verify eligibility
        const eligibility = await LoanEligibility.findOne({
            _id: eligibility_id,
            user_id: req.user.id
        }).populate('eligible_products.product_id');

        if (!eligibility) {
            return res.status(400).json({ message: 'Invalid eligibility ID' });
        }

        const eligibleProduct = eligibility.eligible_products.find(
            p => p.product_id._id.toString() === product_id
        );

        if (!eligibleProduct || amount > eligibleProduct.max_eligible_amount) {
            return res.status(400).json({ message: 'Not eligible for this loan' });
        }

        // Create application
        const application = new LoanApplication({
            user_id: req.user.id,
            loan_product_id: product_id,
            admin_id: eligibleProduct.product_id.admin_id,
            limit: amount,
            tenure_months: tenure_months || eligibleProduct.recommended_tenure,
            eligibility_id: eligibility._id
        });

        await application.save();

        res.status(201).json(application);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
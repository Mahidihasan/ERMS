const express = require('express');
const router = express.Router();

// Import controller functions that handle the business logic
const { createHelpRequest, getMyRequests } = require('../controllers/userController');

// Import authentication middleware to protect routes
const { verifyUser } = require('../utils/authMiddleware');

/**
 * @route   POST /api/users/helpRequest
 * @desc    Allows a logged-in user to create a new help request
 * @access  Protected: only authenticated users
 * 
 * Flow:
 * 1. verifyUser middleware checks if the request has a valid Firebase token
 * 2. Controller function 'createHelpRequest' handles saving data to Firestore
 */
router.post('/helpRequest', verifyUser, createHelpRequest);

/**
 * @route   GET /api/users/myRequests
 * @desc    Retrieves all help requests created by the logged-in user
 * @access  Protected: only authenticated users
 * 
 * Flow:
 * 1. verifyUser middleware ensures the user is logged in
 * 2. Controller function 'getMyRequests' queries Firestore for user's requests
 */
router.get('/myRequests', verifyUser, getMyRequests);

// Export router so it can be used in server.js
module.exports = router;

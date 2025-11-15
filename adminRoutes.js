const express = require('express');
const router = express.Router();

// Import controller functions that handle admin operations
const { getAllRequests, assignVolunteer } = require('../controllers/adminController');

// Import authentication and role-check middleware
const { verifyUser, verifyAdmin } = require('../utils/authMiddleware');

/**
 * @route   GET /api/admin/requests
 * @desc    Get all help requests in the system (admin view)
 * @access  Protected: only admin users
 * 
 * Flow:
 * 1. verifyUser ensures the request is from a logged-in user
 * 2. verifyAdmin ensures the user has admin privileges
 * 3. Controller 'getAllRequests' fetches all requests from Firestore
 */
router.get('/requests', verifyUser, verifyAdmin, getAllRequests);

/**
 * @route   PUT /api/admin/assignVolunteer/:id
 * @desc    Assigns a volunteer to a specific help request
 * @access  Protected: only admin users
 * @params  :id -> the Firestore document ID of the help request
 * @body    { volunteerId: string } -> ID of the volunteer being assigned
 * 
 * Flow:
 * 1. verifyUser checks if the requester is logged in
 * 2. verifyAdmin checks if the requester has admin rights
 * 3. Controller 'assignVolunteer' updates the help request in Firestore
 */
router.put('/assignVolunteer/:id', verifyUser, verifyAdmin, assignVolunteer);

// Export router so it can be used in server.js
module.exports = router;

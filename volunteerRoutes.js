const express = require('express');
const router = express.Router();

// Import controller functions that handle volunteer actions
const { getTasks, markTaskComplete } = require('../controllers/volunteerController');

// Import authentication and role-check middleware
const { verifyUser, verifyVolunteer } = require('../utils/authMiddleware');

/**
 * @route   GET /api/volunteers/tasks
 * @desc    Get all help requests assigned to the logged-in volunteer
 * @access  Protected: only volunteer users
 * 
 * Flow:
 * 1. verifyUser ensures the requester is logged in
 * 2. verifyVolunteer ensures the user has volunteer role
 * 3. Controller 'getTasks' fetches tasks assigned to this volunteer
 */
router.get('/tasks', verifyUser, verifyVolunteer, getTasks);

/**
 * @route   PUT /api/volunteers/taskComplete/:id
 * @desc    Mark a specific help request as completed by the volunteer
 * @access  Protected: only volunteer users
 * @params  :id -> the Firestore document ID of the help request
 * 
 * Flow:
 * 1. verifyUser checks authentication
 * 2. verifyVolunteer checks role
 * 3. Controller 'markTaskComplete' updates the task status in Firestore
 */
router.put('/taskComplete/:id', verifyUser, verifyVolunteer, markTaskComplete);

// Export router so it can be used in server.js
module.exports = router;

// Import functions that interact with Firebase database
const { addHelpRequest, fetchUserRequests } = require('../services/firebaseService');

/**
 * @desc    Create a new help request for the logged-in user
 * @access  Protected: User must be authenticated
 * @req     req.body -> object containing request details (location, priority, description, etc.)
 * @req     req.user -> Firebase user info provided by verifyUser middleware
 * @res     JSON with success message and created request ID
 */
async function createHelpRequest(req, res) {
    try {
        // Data sent from frontend
        const requestData = req.body;

        // req.user.uid comes from Firebase token
        const result = await addHelpRequest(requestData, req.user.uid);

        // Return success response
        res.status(200).json({
            message: "Help request created successfully",
            data: result
        });
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

/**
 * @desc    Get all help requests created by the logged-in user
 * @access  Protected: User must be authenticated
 * @req     req.user.uid -> used to fetch requests
 * @res     JSON array of help requests
 */
async function getMyRequests(req, res) {
    try {
        const requests = await fetchUserRequests(req.user.uid);
        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { createHelpRequest, getMyRequests };

// Import Firebase service functions
const { fetchAllRequests, assignVolunteerToRequest } = require('../services/firebaseService');

/**
 * @desc    Get all help requests in the system (Admin view)
 * @access  Protected: Admin only
 * @res     JSON array of all requests
 */
async function getAllRequests(req, res) {
    try {
        const requests = await fetchAllRequests();
        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

/**
 * @desc    Assign a volunteer to a specific help request
 * @access  Protected: Admin only
 * @req     req.params.id -> help request ID
 * @req     req.body.volunteerId -> ID of volunteer being assigned
 * @res     Success message
 */
async function assignVolunteer(req, res) {
    try {
        const requestId = req.params.id;              // ID of the help request
        const { volunteerId } = req.body;            // Volunteer to assign

        // Update request in Firebase
        await assignVolunteerToRequest(requestId, volunteerId);

        res.status(200).json({ message: "Volunteer assigned successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getAllRequests, assignVolunteer };

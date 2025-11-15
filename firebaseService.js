// Import Firebase admin from config
const { admin } = require('../config/firebaseConfig');

// Get Firestore database reference
const db = admin.firestore();

/**
 * @desc    Add a new help request to Firestore
 * @param   data - object containing help request details (location, description, priority)
 * @param   userId - ID of the user creating the request
 * @returns object containing the new document ID
 */
async function addHelpRequest(data, userId) {
    try {
        // Add document to 'helpRequests' collection
        const docRef = await db.collection('helpRequests').add({
            ...data,                       // spread user-provided request details
            userId,                         // link request to user
            status: 'pending',              // initial status
            createdAt: admin.firestore.FieldValue.serverTimestamp() // timestamp
        });

        // Return the new document ID
        return { id: docRef.id };
    } catch (err) {
        console.error("Error adding help request:", err);
        throw err;
    }
}

/**
 * @desc    Fetch all help requests created by a specific user
 * @param   userId - Firebase UID of the user
 * @returns array of requests
 */
async function fetchUserRequests(userId) {
    try {
        const snapshot = await db.collection('helpRequests')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc') // latest first
            .get();

        // Map documents to objects
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
        console.error("Error fetching user requests:", err);
        throw err;
    }
}

/**
 * @desc    Fetch all help requests (for admin)
 * @returns array of all requests
 */
async function fetchAllRequests() {
    try {
        const snapshot = await db.collection('helpRequests')
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
        console.error("Error fetching all requests:", err);
        throw err;
    }
}

/**
 * @desc    Assign a volunteer to a help request
 * @param   requestId - ID of the help request
 * @param   volunteerId - ID of the volunteer
 */
async function assignVolunteerToRequest(requestId, volunteerId) {
    try {
        await db.collection('helpRequests').doc(requestId).update({
            assignedVolunteer: volunteerId, // assign volunteer
            status: 'assigned'             // update status
        });
    } catch (err) {
        console.error("Error assigning volunteer:", err);
        throw err;
    }
}

/**
 * @desc    Fetch all tasks assigned to a volunteer
 * @param   volunteerId - ID of the volunteer
 * @returns array of assigned tasks
 */
async function fetchVolunteerTasks(volunteerId) {
    try {
        const snapshot = await db.collection('helpRequests')
            .where('assignedVolunteer', '==', volunteerId)
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
        console.error("Error fetching volunteer tasks:", err);
        throw err;
    }
}

/**
 * @desc    Mark a task as completed
 * @param   taskId - ID of the help request
 */
async function completeTask(taskId) {
    try {
        await db.collection('helpRequests').doc(taskId).update({
            status: 'completed', // mark task as done
            completedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    } catch (err) {
        console.error("Error marking task complete:", err);
        throw err;
    }
}

// Export all service functions
module.exports = {
    addHelpRequest,
    fetchUserRequests,
    fetchAllRequests,
    assignVolunteerToRequest,
    fetchVolunteerTasks,
    completeTask
};

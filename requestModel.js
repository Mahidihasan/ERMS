/**
 * Help Request Model
 * 
 * Represents a help request created by a user.
 * Stored in Firestore under 'helpRequests' collection.
 * 
 * Fields:
 * - userId: UID of the user who created the request
 * - assignedVolunteer: UID of volunteer assigned (string, optional)
 * - location: string or object (latitude, longitude)
 * - priority: string -> 'high', 'medium', 'low'
 * - description: string -> details of help needed
 * - status: string -> 'pending', 'assigned', 'completed'
 * - createdAt: timestamp when request was created
 * - completedAt: timestamp when task is completed (optional)
 */

const requestModel = {
    userId: '',               // UID of request creator
    assignedVolunteer: null,  // UID of volunteer, null if not assigned
    location: '',             // Could be address or {lat, lng}
    priority: 'medium',       // default priority
    description: '',          // Details of help
    status: 'pending',        // Initial status
    createdAt: null,          // Timestamp
    completedAt: null         // Timestamp when task completed
};

module.exports = requestModel;

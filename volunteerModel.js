/**
 * Volunteer Model
 * 
 * Represents a volunteer in the system.
 * Stored in Firebase `users` collection or separate `volunteers` collection.
 * 
 * Fields:
 * - uid: Firebase UID (string) -> unique identifier
 * - name: volunteer name
 * - email: volunteer email
 * - tasks: array of assigned help request IDs
 * - availability: boolean -> is volunteer available for new requests
 * - role: should always be 'volunteer'
 */

const volunteerModel = {
    uid: '',           // Firebase UID
    name: '',          // Full name
    email: '',         // Email
    tasks: [],         // Array of assigned request IDs
    availability: true, // Available for tasks
    role: 'volunteer'  // Role
};

module.exports = volunteerModel;

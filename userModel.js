/**
 * User Model
 * 
 * This is a reference schema for users in the system.
 * In Firebase, you would typically store users in the `users` collection.
 * 
 * Fields:
 * - uid: Firebase UID (string) -> unique identifier
 * - name: full name of the user (string)
 * - email: user email (string)
 * - role: user role (string) -> 'user', 'admin', or 'volunteer'
 * - createdAt: timestamp when user was created
 */

const userModel = {
    uid: '',          // Firebase UID
    name: '',         // Full name
    email: '',        // Email
    role: 'user',     // default role
    createdAt: null   // timestamp
};

module.exports = userModel;

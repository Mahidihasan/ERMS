/**
 * Simple notification helper
 * For now, just logs messages
 * Later you can integrate Firebase Cloud Messaging (FCM) or Socket.io
 */
function notifyUser(userId, message) {
    console.log(`Notify user ${userId}: ${message}`);
}

function notifyVolunteer(volunteerId, message) {
    console.log(`Notify volunteer ${volunteerId}: ${message}`);
}

function notifyAdmin(adminId, message) {
    console.log(`Notify admin ${adminId}: ${message}`);
}

module.exports = { notifyUser, notifyVolunteer, notifyAdmin };

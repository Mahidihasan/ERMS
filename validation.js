/**
 * Validate help request data from user
 * @param {Object} data - object containing request fields
 * @returns {Object} - { valid: boolean, errors: array }
 */
function validateHelpRequest(data) {
    const errors = [];

    if (!data.location || data.location === "") {
        errors.push("Location is required");
    }
    if (!data.priority || !["high", "medium", "low"].includes(data.priority)) {
        errors.push("Priority must be 'high', 'medium', or 'low'");
    }
    if (!data.description || data.description.length < 5) {
        errors.push("Description must be at least 5 characters");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = { validateHelpRequest };

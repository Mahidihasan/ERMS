const { admin } = require('../config/firebaseConfig');

/**
 * Middleware: Verify Firebase user token
 * Ensures the request is from a logged-in user
 */
async function verifyUser(req, res, next) {
    try {
        // Get token from Authorization header (format: "Bearer <token>")
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "No token provided" });

        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach user info to request object
        next(); // Proceed to next middleware or controller
    } catch (err) {
        console.error("verifyUser error:", err);
        res.status(401).json({ error: "Unauthorized" });
    }
}

/**
 * Middleware: Verify Admin role
 * Only allows users with role === 'admin'
 */
function verifyAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    next();
}

/**
 * Middleware: Verify Volunteer role
 * Only allows users with role === 'volunteer'
 */
function verifyVolunteer(req, res, next) {
    if (req.user.role !== 'volunteer') {
        return res.status(403).json({ error: "Forbidden: Volunteers only" });
    }
    next();
}

module.exports = { verifyUser, verifyAdmin, verifyVolunteer };

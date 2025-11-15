// ==========================
// IMPORTS
// ==========================
const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");

// Import Firebase admin (already initialized in config)
const { admin } = require("./config/firebaseConfig");

// Initialize Socket.io
const initSocket = require("./sockets/socket");

// ==========================
// APP SETUP
// ==========================
const app = express();
const server = http.createServer(app);

// Enable CORS for frontend (adjust origin in production)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

// Parse incoming JSON requests
app.use(bodyParser.json());

// ==========================
// SOCKET.IO SETUP
// ==========================
const { io, emitToUser, emitToAdmins, emitToVolunteers } = initSocket(server);

// ==========================
// ROUTES
// ==========================

// Health check route
app.get("/", (req, res) => {
    res.send("Emergency backend server is running!");
});

// User routes
app.use("/api/users", userRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Volunteer routes
app.use("/api/volunteers", volunteerRoutes);

// ==========================
// REAL-TIME EXAMPLE HOOKS
// ==========================
// Example: Emit new request notification to admins
// Call this in userController.js after creating a help request
/*
emitToAdmins("newRequest", {
    requestId: newRequestId,
    userId: req.user.uid,
    priority: requestData.priority
});
*/

// Example: Emit task assignment to volunteer
// Call this in adminController.js after assigning a volunteer
/*
emitToUser(volunteerId, "taskAssigned", {
    requestId: requestId,
    location: requestLocation,
    priority: requestPriority
});
*/

// ==========================
// ERROR HANDLING
// ==========================

// Handle 404 for unknown routes
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

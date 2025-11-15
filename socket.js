const { Server } = require("socket.io");

/**
 * Initialize Socket.io for real-time communication
 * @param {http.Server} server - The HTTP server created by Express
 * @returns {Server} io instance
 */
function initSocket(server) {
    // Create a new Socket.io server instance
    const io = new Server(server, {
        cors: {
            origin: "*", // Replace "*" with your frontend URL in production
            methods: ["GET", "POST", "PUT"]
        }
    });

    // Map to store connected users and their roles
    const connectedUsers = {};

    // Listen for client connections
    io.on("connection", (socket) => {
        console.log(`New client connected: ${socket.id}`);

        /**
         * Event: join
         * Client sends their userId and role after connecting
         * Roles: 'user', 'admin', 'volunteer'
         */
        socket.on("join", ({ userId, role }) => {
            connectedUsers[userId] = { socketId: socket.id, role };
            console.log(`User joined: ${userId} as ${role}`);
        });

        /**
         * Event: disconnect
         * Remove the user from connectedUsers map when they disconnect
         */
        socket.on("disconnect", () => {
            for (const userId in connectedUsers) {
                if (connectedUsers[userId].socketId === socket.id) {
                    console.log(`User disconnected: ${userId}`);
                    delete connectedUsers[userId];
                    break;
                }
            }
        });
    });

    /**
     * Helper: Emit an event to a specific user by userId
     * @param {string} userId - Firebase UID
     * @param {string} event - Event name
     * @param {any} data - Payload
     */
    function emitToUser(userId, event, data) {
        const user = connectedUsers[userId];
        if (user) {
            io.to(user.socketId).emit(event, data);
        }
    }

    /**
     * Helper: Emit an event to all admins
     * @param {string} event - Event name
     * @param {any} data - Payload
     */
    function emitToAdmins(event, data) {
        for (const userId in connectedUsers) {
            if (connectedUsers[userId].role === "admin") {
                io.to(connectedUsers[userId].socketId).emit(event, data);
            }
        }
    }

    /**
     * Helper: Emit an event to all volunteers
     * @param {string} event - Event name
     * @param {any} data - Payload
     */
    function emitToVolunteers(event, data) {
        for (const userId in connectedUsers) {
            if (connectedUsers[userId].role === "volunteer") {
                io.to(connectedUsers[userId].socketId).emit(event, data);
            }
        }
    }

    // Return the io instance and helpers for external use
    return { io, emitToUser, emitToAdmins, emitToVolunteers };
}

module.exports = initSocket;

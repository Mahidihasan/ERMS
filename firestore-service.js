// firestore-service.js
// Firestore database operations

class FirestoreService {
    constructor() {
        this.db = db;
    }

    // ===== USER MANAGEMENT =====
    async createUser(userId, userData) {
        try {
            await this.db.collection('users').doc(userId).set({
                ...userData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            });
            return true;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async getUser(userId) {
        try {
            const doc = await this.db.collection('users').doc(userId).get();
            return doc.exists ? { id: doc.id, ...doc.data() } : null;
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    }

    async updateUser(userId, updates) {
        try {
            await this.db.collection('users').doc(userId).update({
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // ===== EMERGENCY REQUESTS =====
    async createEmergencyRequest(requestData) {
        try {
            const docRef = await this.db.collection('emergency_requests').add({
                ...requestData,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating emergency request:', error);
            throw error;
        }
    }

    async getPendingRequests() {
        try {
            const snapshot = await this.db.collection('emergency_requests')
                .where('status', '==', 'pending')
                .orderBy('createdAt', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting pending requests:', error);
            throw error;
        }
    }

    async getAllRequests(limit = 50) {
        try {
            const snapshot = await this.db.collection('emergency_requests')
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting all requests:', error);
            throw error;
        }
    }

    async updateRequestStatus(requestId, status, assignedTo = null) {
        try {
            const updates = {
                status: status,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            if (assignedTo) {
                updates.assignedTo = assignedTo;
                updates.assignedAt = firebase.firestore.FieldValue.serverTimestamp();
            }

            await this.db.collection('emergency_requests').doc(requestId).update(updates);
            return true;
        } catch (error) {
            console.error('Error updating request status:', error);
            throw error;
        }
    }

    async deleteRequest(requestId) {
        try {
            await this.db.collection('emergency_requests').doc(requestId).delete();
            return true;
        } catch (error) {
            console.error('Error deleting request:', error);
            throw error;
        }
    }

    // ===== VOLUNTEER MANAGEMENT =====
    async registerVolunteer(volunteerData) {
        try {
            const docRef = await this.db.collection('volunteers').add({
                ...volunteerData,
                status: 'available',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error registering volunteer:', error);
            throw error;
        }
    }

    async getAvailableVolunteers() {
        try {
            const snapshot = await this.db.collection('volunteers')
                .where('status', '==', 'available')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting available volunteers:', error);
            throw error;
        }
    }

    async updateVolunteerStatus(volunteerId, status) {
        try {
            await this.db.collection('volunteers').doc(volunteerId).update({
                status: status,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Error updating volunteer status:', error);
            throw error;
        }
    }

    // ===== STATISTICS =====
    async getSystemStatistics() {
        try {
            const statsDoc = await this.db.collection('statistics').doc('current').get();
            if (statsDoc.exists) {
                return statsDoc.data();
            } else {
                // Return default statistics
                return {
                    totalRequests: 0,
                    resolvedRequests: 0,
                    pendingRequests: 0,
                    activeVolunteers: 0,
                    availableVolunteers: 0,
                    lastUpdated: new Date()
                };
            }
        } catch (error) {
            console.error('Error getting statistics:', error);
            throw error;
        }
    }

    async updateStatistics(updates) {
        try {
            await this.db.collection('statistics').doc('current').set({
                ...updates,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            return true;
        } catch (error) {
            console.error('Error updating statistics:', error);
            throw error;
        }
    }

    // ===== REAL-TIME LISTENERS =====
    setupRequestsListener(callback) {
        return this.db.collection('emergency_requests')
            .where('status', 'in', ['pending', 'assigned'])
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                const requests = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(requests);
            }, (error) => {
                console.error('Requests listener error:', error);
            });
    }

    setupVolunteersListener(callback) {
        return this.db.collection('volunteers')
            .onSnapshot((snapshot) => {
                const volunteers = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(volunteers);
            }, (error) => {
                console.error('Volunteers listener error:', error);
            });
    }

    setupStatisticsListener(callback) {
        return this.db.collection('statistics').doc('current')
            .onSnapshot((doc) => {
                if (doc.exists) {
                    callback(doc.data());
                }
            }, (error) => {
                console.error('Statistics listener error:', error);
            });
    }

    // ===== CHAT SYSTEM =====
    async sendChatMessage(roomId, messageData) {
        try {
            const docRef = await this.db.collection('chat_rooms')
                .doc(roomId)
                .collection('messages')
                .add({
                    ...messageData,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            return docRef.id;
        } catch (error) {
            console.error('Error sending chat message:', error);
            throw error;
        }
    }

    async getChatMessages(roomId, limit = 50) {
        try {
            const snapshot = await this.db.collection('chat_rooms')
                .doc(roomId)
                .collection('messages')
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).reverse(); // Reverse to show oldest first
        } catch (error) {
            console.error('Error getting chat messages:', error);
            throw error;
        }
    }

    setupChatListener(roomId, callback) {
        return this.db.collection('chat_rooms')
            .doc(roomId)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .onSnapshot((snapshot) => {
                const messages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).reverse();
                callback(messages);
            }, (error) => {
                console.error('Chat listener error:', error);
            });
    }
}

// Create global instance
window.firestoreService = new FirestoreService();
console.log("Firestore Service initialized");
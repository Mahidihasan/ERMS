// TODO: Create API service for external backend integration

class APIService {
    constructor() {
        this.baseURL = 'https://your-backend-domain.com/api';
    }
    
    async makeRequest(endpoint, options = {}) {
        try {
            const user = getCurrentUser();
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };
            
            if (user && user.token) {
                headers['Authorization'] = `Bearer ${user.token}`;
            }
            
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    // Emergency Requests API
    async getAllRequests(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return this.makeRequest(`/requests?${queryParams}`);
    }
    
    async updateRequestStatus(requestId, status, notes = '') {
        return this.makeRequest(`/requests/${requestId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, notes })
        });
    }
    
    // Map Data API
    async getHeatmapData(period = '24h') {
        return this.makeRequest(`/map/heatmap?period=${period}`);
    }
    
    async getGeoData(latitude, longitude, radius = 10) {
        return this.makeRequest(`/map/geodata?lat=${latitude}&lng=${longitude}&radius=${radius}`);
    }
    
    // Analytics API
    async getAnalyticsReport(startDate, endDate) {
        return this.makeRequest(`/analytics?start=${startDate}&end=${endDate}`);
    }
    
    // External Service Integration
    async sendSMSNotification(phoneNumber, message) {
        return this.makeRequest('/notifications/sms', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber, message })
        });
    }
    
    async getWeatherAlerts(location) {
        return this.makeRequest(`/weather/alerts?location=${encodeURIComponent(location)}`);
    }
}

window.apiService = new APIService();
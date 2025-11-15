// admin.js
// ===== Emergency Response Admin Panel - Real-Time Ready =====

// ===== AUTHENTICATION CHECK =====

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = getCurrentUser();
    
    // Redirect if not logged in or not an admin role
    if (!user || (user.role !== 'super_admin' && user.role !== 'admin' && user.role !== 'director')) {
        window.location.href = 'login.html';
        return;
    }

    currentAdmin = user;
    initializeSystemAdmin();
});

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
}

function updateAdminInfo(user) {
    // Update header with admin info if needed
    const adminName = document.querySelector('.admin-menu-trigger span');
    if (adminName) {
        adminName.textContent = user.name;
    }
}

// Add logout functionality to admin sidebar
function addAdminLogout() {
    const adminMenu = document.querySelector('.admin-sidebar ul');
    if (adminMenu) {
        const logoutItem = document.createElement('li');
        logoutItem.className = 'nav-item';
        logoutItem.innerHTML = '<a href="#" onclick="adminLogout()">Log out</a>';
        adminMenu.appendChild(logoutItem);
    }
}

function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Call this function after DOM is loaded
setTimeout(addAdminLogout, 100);
// ===== DOM ELEMENTS =====
const requestFeed = document.getElementById('requestFeed');
const filterBtn = document.getElementById('filterBtn');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const hotZonesList = document.getElementById('hotZonesList');

// Statistics
const statRequests = document.getElementById('stat-requests');
const statRescue = document.getElementById('stat-rescue');
const statUnsolved = document.getElementById('stat-unsolved');
const statDeath = document.getElementById('stat-death');

// Volunteers
const volActive = document.getElementById('vol-active');
const volFree = document.getElementById('vol-free');
const volRes = document.getElementById('vol-res');

// ===== MAP VARIABLES =====
let map;
let heatmap;
let markers = [];
let isHeatMapVisible = true;
let isMarkersVisible = true;

// Bangladesh coordinates
const BANGLADESH_CENTER = { lat: 23.6850, lng: 90.3563 };
const BANGLADESH_BOUNDS = {
    north: 26.6310,
    south: 20.7430,
    west: 88.0280,
    east: 92.6730
};

// Major cities in Bangladesh
const BANGLADESH_CITIES = {
    dhaka: { lat: 23.8103, lng: 90.4125, name: "Dhaka" },
    chattogram: { lat: 22.3569, lng: 91.7832, name: "Chattogram" },
    sylhet: { lat: 24.8949, lng: 91.8687, name: "Sylhet" },
    khulna: { lat: 22.8456, lng: 89.5403, name: "Khulna" },
    rajshahi: { lat: 24.3745, lng: 88.6042, name: "Rajshahi" },
    barishal: { lat: 22.7010, lng: 90.3535, name: "Barishal" },
    rangpur: { lat: 25.7439, lng: 89.2752, name: "Rangpur" }
};

// ===== APPLICATION STATE =====
let appState = {
    requests: [],
    volunteers: { active: 0, free: 0, reserve: 0 },
    statistics: { requests: 0, rescues: 0, unsolved: 0, deaths: 0 },
    chat: { messages: [], connected: false },
    filters: { active: 'all', options: ['all','urgent','medical','rescue','sylhet','dhaka','chattogram'] },
    currentView: 'dashboard'
};

// ===== REAL-TIME CONNECTION =====
let realTimeConnection = null;
const RECONNECT_DELAY = 5000; // 5 seconds

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Emergency Response Admin Panel Initialized');
    
    initializeRealTimeConnection();
    setupEventListeners();
    updateUI();
    
    // Load Google Maps API
    loadGoogleMapsAPI();
});

// ===== REAL-TIME CONNECTION MANAGEMENT =====
function initializeRealTimeConnection() {
    // This will be replaced with actual WebSocket/SSE connection
    // For now, we'll simulate connection setup
    console.log('Initializing real-time connection...');
    
    // Simulate connection success
    setTimeout(() => {
        appState.chat.connected = true;
        console.log('Real-time connection established');
        
        // Start polling for updates (replace with WebSocket events later)
        startDataPolling();
    }, 1000);
}

function startDataPolling() {
    // Poll for updates every 10 seconds
    setInterval(fetchLatestData, 10000);
    
    // Initial data fetch
    fetchLatestData();
}

async function fetchLatestData() {
    try {
        // Replace with actual API endpoints
        const endpoints = {
            requests: '/api/requests/pending',
            statistics: '/api/statistics',
            volunteers: '/api/volunteers/status',
            chat: '/api/chat/messages'
        };

        // Simulate API calls - replace with actual fetch calls
        const newData = await simulateAPICalls(endpoints);
        
        // Update application state
        updateApplicationState(newData);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        showNotification('Failed to fetch latest data', 'error');
    }
}

async function simulateAPICalls(endpoints) {
    // Simulate API response - replace with actual fetch calls
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                requests: [],
                statistics: { requests: 0, rescues: 0, unsolved: 0, deaths: 0 },
                volunteers: { active: 0, free: 0, reserve: 0 },
                chat: []
            });
        }, 500);
    });
}

function updateApplicationState(newData) {
    // Update requests if changed
    if (newData.requests && JSON.stringify(newData.requests) !== JSON.stringify(appState.requests)) {
        appState.requests = newData.requests;
        updateRequestFeed();
        updateHeatMapData();
    }
    
    // Update statistics if changed
    if (newData.statistics && JSON.stringify(newData.statistics) !== JSON.stringify(appState.statistics)) {
        appState.statistics = newData.statistics;
        updateStatistics();
    }
    
    // Update volunteers if changed
    if (newData.volunteers && JSON.stringify(newData.volunteers) !== JSON.stringify(appState.volunteers)) {
        appState.volunteers = newData.volunteers;
        updateStatistics();
    }
    
    // Update chat if changed
    if (newData.chat && JSON.stringify(newData.chat) !== JSON.stringify(appState.chat.messages)) {
        appState.chat.messages = newData.chat;
        updateChatMessages();
    }
}

// ===== GOOGLE MAPS INTEGRATION =====
function loadGoogleMapsAPI() {
    const apiKey = 'YOUR_API_KEY_HERE';
    if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
        console.warn('Google Maps API key not set.');
        return;
    }
    
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization&callback=initBangladeshMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }
}

function initBangladeshMap() {
    const mapElement = document.getElementById('bangladeshMap');
    if (!mapElement) return;

    map = new google.maps.Map(mapElement, {
        center: BANGLADESH_CENTER,
        zoom: 7,
        minZoom: 6,
        maxZoom: 12,
        restriction: {
            latLngBounds: BANGLADESH_BOUNDS,
            strictBounds: false
        },
        styles: [
            {
                elementType: "geometry",
                stylers: [{ color: "#1e1e1e" }]
            },
            {
                elementType: "labels.text.fill",
                stylers: [{ color: "#757575" }]
            },
            {
                elementType: "labels.text.stroke",
                stylers: [{ color: "#1e1e1e" }]
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#1a3c5c" }]
            }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: [],
        map: map,
        radius: 25,
        opacity: 0.6
    });

    updateHeatMapData();
}

function updateHeatMapData() {
    if (!heatmap) return;

    heatmap.setData([]);
    clearMarkers();

    const heatMapData = [];
    const locationDensity = {};

    appState.requests.forEach(request => {
        if (!request.location) return;

        const closestCity = findClosestCity(request.location);
        const cityKey = closestCity.key;

        if (!locationDensity[cityKey]) {
            locationDensity[cityKey] = {
                count: 0,
                coordinates: closestCity.coordinates,
                name: closestCity.name
            };
        }
        
        locationDensity[cityKey].count++;
    });

    Object.keys(locationDensity).forEach(cityKey => {
        const locationData = locationDensity[cityKey];
        const points = generateHeatPoints(locationData.coordinates, locationData.count);
        heatMapData.push(...points);
        addLocationMarker(locationData.coordinates, locationData.count, locationData.name);
    });

    heatmap.setData(heatMapData);
    updateHotZonesList(locationDensity);
}

function findClosestCity(requestCoords) {
    let closest = { 
        key: 'unknown', 
        coordinates: requestCoords, 
        name: 'Unknown Location', 
        distance: Infinity 
    };

    Object.keys(BANGLADESH_CITIES).forEach(cityKey => {
        const city = BANGLADESH_CITIES[cityKey];
        const distance = calculateDistance(requestCoords, city);
        
        if (distance < closest.distance && distance < 1.0) {
            closest = {
                key: cityKey,
                coordinates: city,
                name: city.name,
                distance: distance
            };
        }
    });

    return closest;
}

function calculateDistance(coord1, coord2) {
    const latDiff = Math.abs(coord1.lat - coord2.lat);
    const lngDiff = Math.abs(coord1.lng - coord2.lng);
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
}

function generateHeatPoints(centerCoords, density) {
    const points = [];
    const pointCount = Math.min(density * 2, 30);
    
    for (let i = 0; i < pointCount; i++) {
        const jitteredLat = centerCoords.lat + (Math.random() - 0.5) * 0.05;
        const jitteredLng = centerCoords.lng + (Math.random() - 0.5) * 0.05;
        points.push(new google.maps.LatLng(jitteredLat, jitteredLng));
    }
    
    return points;
}

function addLocationMarker(coords, density, locationName) {
    if (!map) return;

    const markerSize = Math.min(8 + density, 20);
    
    const marker = new google.maps.Marker({
        position: coords,
        map: isMarkersVisible ? map : null,
        title: `${locationName}: ${density} requests`,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: markerSize,
            fillColor: getDensityColor(density),
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 1
        }
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="color: #333; padding: 5px;">
                <h4 style="margin: 0 0 5px 0;">${locationName}</h4>
                <p style="margin: 0;"><strong>Active Requests:</strong> ${density}</p>
                <p style="margin: 0;"><strong>Priority:</strong> ${getDensityLevel(density)}</p>
            </div>
        `
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    markers.push(marker);
}

function getDensityColor(density) {
    if (density >= 16) return '#d32f2f';
    if (density >= 6) return '#ff9800';
    return '#ffeb3b';
}

function getDensityLevel(density) {
    if (density >= 16) return 'High';
    if (density >= 6) return 'Medium';
    return 'Low';
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

// ===== HOT ZONES MANAGEMENT =====
function updateHotZonesList(locationDensity) {
    if (!hotZonesList) return;

    const sortedZones = Object.values(locationDensity)
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

    hotZonesList.innerHTML = '';
    
    sortedZones.forEach((zone, index) => {
        const zoneElement = createHotZoneElement(zone, index + 1);
        hotZonesList.appendChild(zoneElement);
    });
}

function createHotZoneElement(zone, rank) {
    const zoneElement = document.createElement('div');
    const priority = getDensityLevel(zone.count);
    
    zoneElement.className = `hotzone-item ${rank === 1 ? 'zone-1' : ''}`;
    zoneElement.innerHTML = `
        <div class="hotzone-rank hotzone-rank-${rank}">${rank}</div>
        <div class="hotzone-info">
            <div class="hotzone-name">${zone.name}</div>
            <div class="hotzone-requests">${zone.count} requests</div>
        </div>
        <span class="hotzone-priority priority-${priority.toLowerCase()}">${priority}</span>
    `;

    return zoneElement;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    filterBtn?.addEventListener('click', showFilterModal);
    chatInput?.addEventListener('click', openChatInterface);
    
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// ===== REQUEST MANAGEMENT =====
function updateRequestFeed() {
    if (!requestFeed) return;
    
    requestFeed.innerHTML = '';
    const filteredRequests = appState.requests.filter(request => 
        request.status === 'pending'
    );

    filteredRequests.forEach(request => {
        requestFeed.appendChild(createRequestCard(request));
    });
}

function createRequestCard(request) {
    const card = document.createElement('div');
    card.className = `request-card priority-${request.priority}`;
    card.dataset.requestId = request.id;
    
    const timestamp = new Date(request.timestamp).toLocaleTimeString();
    const timeAgo = getTimeAgo(request.timestamp);

    card.innerHTML = `
        <div class="request-header">
            <h4>${request.name} • ${timestamp}</h4>
            <span class="time-ago">${timeAgo}</span>
            <div class="priority-badge ${request.priority}">${request.priority.toUpperCase()}</div>
        </div>
        <p>${request.text}</p>
        <div class="request-meta">
            <span class="contact">${request.contact}</span>
            <span class="people">${request.peopleCount} people</span>
        </div>
        <div class="tags">
            ${request.tags.map(tag => `<span class="tag ${tag.toLowerCase()}">${tag}</span>`).join('')}
        </div>
        <div class="request-actions">
            <button class="btn-assign" onclick="assignVolunteer('${request.id}')">Assign Team</button>
            <button class="btn-resolve" onclick="resolveRequest('${request.id}')">Mark Resolved</button>
            <button class="btn-details" onclick="showRequestDetails('${request.id}')">Details</button>
        </div>
    `;

    return card;
}

async function assignVolunteer(requestId) {
    try {
        // Replace with actual API call
        const response = await fetch(`/api/requests/${requestId}/assign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            showNotification('Volunteer assigned successfully', 'success');
            fetchLatestData(); // Refresh data
        } else {
            showNotification('Failed to assign volunteer', 'error');
        }
    } catch (error) {
        console.error('Error assigning volunteer:', error);
        showNotification('Error assigning volunteer', 'error');
    }
}

async function resolveRequest(requestId) {
    try {
        // Replace with actual API call
        const response = await fetch(`/api/requests/${requestId}/resolve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            showNotification('Request resolved successfully', 'success');
            fetchLatestData(); // Refresh data
        } else {
            showNotification('Failed to resolve request', 'error');
        }
    } catch (error) {
        console.error('Error resolving request:', error);
        showNotification('Error resolving request', 'error');
    }
}

function showRequestDetails(requestId) {
    const request = appState.requests.find(r => r.id === requestId);
    if (!request) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Request Details</h3>
                <button class="btn-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <div class="detail-section">
                    <h4>Requester Information</h4>
                    <p><strong>Name:</strong> ${request.name}</p>
                    <p><strong>Contact:</strong> ${request.contact}</p>
                    <p><strong>People:</strong> ${request.peopleCount}</p>
                </div>
                <div class="detail-section">
                    <h4>Emergency Details</h4>
                    <p>${request.text}</p>
                    <p><strong>Priority:</strong> <span class="priority-badge ${request.priority}">${request.priority.toUpperCase()}</span></p>
                </div>
                <div class="detail-section">
                    <h4>Location & Tags</h4>
                    <div class="tags">
                        ${request.tags.map(tag => `<span class="tag ${tag.toLowerCase()}">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// ===== UTILITY FUNCTIONS =====
function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
}

function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 80px;
                right: 20px;
                background: #272727;
                color: white;
                padding: 12px;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 300px;
            }
            .notification.success { border-left: 4px solid #2fb26a; }
            .notification.error { border-left: 4px solid #e02b2b; }
            .notification.info { border-left: 4px solid #3a86ff; }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: 10px;
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

function updateUI() {
    updateRequestFeed();
    updateStatistics();
}

function updateStatistics() {
    if (statRequests) statRequests.textContent = appState.statistics.requests;
    if (statRescue) statRescue.textContent = appState.statistics.rescues >= 1000 ? 
        (appState.statistics.rescues / 1000).toFixed(1) + 'k' : appState.statistics.rescues;
    if (statUnsolved) statUnsolved.textContent = appState.statistics.unsolved;
    if (statDeath) statDeath.textContent = appState.statistics.deaths;
    
    if (volActive) volActive.textContent = appState.volunteers.active;
    if (volFree) volFree.textContent = appState.volunteers.free;
    if (volRes) volRes.textContent = appState.volunteers.reserve;
}

function handleKeyboardShortcuts(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        showFilterModal();
    }
    
    if (event.key === 'Escape') {
        closeModal();
    }
}

// ===== FILTER SYSTEM =====
function showFilterModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Filter Requests</h3>
                <button class="btn-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <div class="filter-options">
                    ${appState.filters.options.map(option => `
                        <label class="filter-option">
                            <input type="radio" name="filter" value="${option}" ${appState.filters.active === option ? 'checked' : ''}>
                            <span>${option.charAt(0).toUpperCase() + option.slice(1)}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn-primary" onclick="applyFilters()">Apply Filters</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function applyFilters() {
    const selectedFilter = document.querySelector('input[name="filter"]:checked')?.value;
    if (selectedFilter) {
        appState.filters.active = selectedFilter;
        updateRequestFeed();
        closeModal();
        showNotification(`Filter applied: ${selectedFilter}`, 'success');
    }
}

// ===== CHAT SYSTEM =====
function openChatInterface() {
    showNotification('Chat interface would open here', 'info');
}

function updateChatMessages() {
    if (!chatMessages) return;
    
    chatMessages.innerHTML = '';
    appState.chat.messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.sender}: ${message.message}`;
        chatMessages.appendChild(messageElement);
    });
}

// ===== MAP CONTROLS =====
function toggleHeatMap() {
    if (!heatmap) return;
    
    isHeatMapVisible = !isHeatMapVisible;
    heatmap.setMap(isHeatMapVisible ? map : null);
    
    const button = document.querySelector('.heat-map-controls button:first-child');
    if (button) {
        button.textContent = isHeatMapVisible ? 'Hide Heat' : 'Show Heat';
    }
    
    showNotification(isHeatMapVisible ? 'Heat map visible' : 'Heat map hidden', 'info');
}

function toggleMarkers() {
    isMarkersVisible = !isMarkersVisible;
    
    markers.forEach(marker => {
        marker.setMap(isMarkersVisible ? map : null);
    });
    
    const button = document.querySelector('.heat-map-controls button:last-child');
    if (button) {
        button.textContent = isMarkersVisible ? 'Hide Markers' : 'Show Markers';
    }
    
    showNotification(isMarkersVisible ? 'Markers visible' : 'Markers hidden', 'info');
}
// Updated logout function for volunteer portal
function volunteerLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html?logout=true';
    }
}

// Updated logout function for admin portal
function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html?logout=true';
    }
}
// Add to admin.js - Firebase integration for admin panel

// Initialize Firebase data when admin panel loads
async function initializeFirebaseAdmin() {
    try {
        // Setup real-time listeners
        setupAdminRealTimeListeners();
        
        // Load initial data
        await loadAdminInitialData();
        
        console.log('Firebase admin initialized');
    } catch (error) {
        console.error('Firebase admin initialization failed:', error);
    }
}

// Setup real-time listeners for admin panel
function setupAdminRealTimeListeners() {
    // Real-time requests listener
    firestoreService.setupRequestsListener((requests) => {
        appState.requests = requests;
        updateRequestFeed();
        updateHeatMapData();
        updateStatistics();
    });

    // Real-time volunteers listener
    firestoreService.setupVolunteersListener((volunteers) => {
        updateVolunteerStatistics(volunteers);
    });

    // Real-time statistics listener
    firestoreService.setupStatisticsListener((stats) => {
        appState.statistics = stats;
        updateStatistics();
    });
}

// Load initial data for admin panel
async function loadAdminInitialData() {
    try {
        const [requests, volunteers, stats] = await Promise.all([
            firestoreService.getAllRequests(),
            firestoreService.getAvailableVolunteers(),
            firestoreService.getSystemStatistics()
        ]);

        appState.requests = requests;
        updateVolunteerStatistics(volunteers);
        appState.statistics = stats;
        
        updateUI();
    } catch (error) {
        console.error('Error loading initial admin data:', error);
        showNotification('Failed to load initial data', 'error');
    }
}

// Update volunteer statistics
function updateVolunteerStatistics(volunteers) {
    const active = volunteers.length;
    const free = volunteers.filter(v => v.status === 'available').length;
    
    appState.volunteers = {
        active: active,
        free: free,
        reserve: Math.max(0, active - free)
    };
    
    updateStatistics();
}

// Update assignVolunteer function with Firebase
async function assignVolunteer(requestId) {
    try {
        const availableVolunteers = await firestoreService.getAvailableVolunteers();
        
        if (availableVolunteers.length === 0) {
            showNotification('No available volunteers at the moment', 'warning');
            return;
        }

        // For now, assign to first available volunteer
        const volunteer = availableVolunteers[0];
        
        await firestoreService.updateRequestStatus(requestId, 'assigned', volunteer.id);
        await firestoreService.updateVolunteerStatus(volunteer.id, 'assigned');
        
        showNotification(`Request assigned to ${volunteer.name}`, 'success');
        
    } catch (error) {
        console.error('Error assigning volunteer:', error);
        showNotification('Failed to assign volunteer', 'error');
    }
}

// Update resolveRequest function with Firebase
async function resolveRequest(requestId) {
    try {
        await firestoreService.updateRequestStatus(requestId, 'resolved');
        
        // Update statistics
        const stats = await firestoreService.getSystemStatistics();
        await firestoreService.updateStatistics({
            resolvedRequests: (stats.resolvedRequests || 0) + 1,
            pendingRequests: Math.max(0, (stats.pendingRequests || 1) - 1)
        });
        
        showNotification('Request marked as resolved', 'success');
        
    } catch (error) {
        console.error('Error resolving request:', error);
        showNotification('Failed to resolve request', 'error');
    }
}

// Update your existing DOMContentLoaded event listener in admin.js
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = getCurrentUser();
    
    // Redirect if not logged in or not an admin role
    if (!user || (user.role !== 'super_admin' && user.role !== 'admin' && user.role !== 'director')) {
        window.location.href = 'login.html';
        return;
    }

    currentAdmin = user;
    initializeSystemAdmin();
    initializeFirebaseAdmin(); // Add this line
});



// ===== EXPORT FUNCTIONS =====
window.assignVolunteer = assignVolunteer;
window.resolveRequest = resolveRequest;
window.showRequestDetails = showRequestDetails;
window.closeModal = closeModal;
window.applyFilters = applyFilters;
window.toggleHeatMap = toggleHeatMap;
window.toggleMarkers = toggleMarkers;
window.fetchLatestData = fetchLatestData; // For manual refresh if needed
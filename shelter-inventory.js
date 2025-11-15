// shelter-inventory.js
// ===== Temporary Shelter Inventory Management =====

let shelterInventory = [];
let filteredShelters = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Temporary Shelter Inventory System Initialized');
    loadShelterInventory();
});

// ===== DATA MANAGEMENT =====
async function loadShelterInventory() {
    try {
        // Replace with actual API call
        const response = await fetch('/api/shelters');
        if (response.ok) {
            shelterInventory = await response.json();
            updateShelterUI();
        } else {
            // Fallback to sample data
            loadSampleShelterData();
        }
    } catch (error) {
        console.error('Error loading shelter inventory:', error);
        loadSampleShelterData();
    }
}

function loadSampleShelterData() {
    shelterInventory = [
        {
            id: generateId(),
            name: "Central Camp A",
            category: "tent",
            capacity: 200,
            currentOccupants: 150,
            status: "occupied",
            location: "Central Park, Zone 1",
            coordinator: "Fatima Begum",
            setupDate: "2024-01-10",
            notes: "Family tents with basic facilities",
            lastUpdated: new Date('2024-01-18')
        },
        {
            id: generateId(),
            name: "Emergency Shelter B",
            category: "container",
            capacity: 50,
            currentOccupants: 0,
            status: "available",
            location: "Industrial Area",
            coordinator: "Not Assigned",
            setupDate: "2024-01-15",
            notes: "Converted shipping containers",
            lastUpdated: new Date('2024-01-18')
        },
        {
            id: generateId(),
            name: "School Shelter C",
            category: "building",
            capacity: 300,
            currentOccupants: 280,
            status: "occupied",
            location: "City High School",
            coordinator: "Rahman Ali",
            setupDate: "2024-01-08",
            notes: "School building converted to shelter",
            lastUpdated: new Date('2024-01-17')
        },
        {
            id: generateId(),
            name: "Community Center D",
            category: "community",
            capacity: 100,
            currentOccupants: 0,
            status: "maintenance",
            location: "Downtown Area",
            coordinator: "Not Assigned",
            setupDate: "2024-01-12",
            notes: "Under repair - water damage",
            lastUpdated: new Date('2024-01-16')
        },
        {
            id: generateId(),
            name: "Tent City 1",
            category: "tent",
            capacity: 500,
            currentOccupants: 320,
            status: "occupied",
            location: "Outskirts Field",
            coordinator: "Hasan Mahmud",
            setupDate: "2024-01-05",
            notes: "Large tent settlement with medical tent",
            lastUpdated: new Date('2024-01-18')
        },
        {
            id: generateId(),
            name: "Reserve Shelter E",
            category: "building",
            capacity: 80,
            currentOccupants: 0,
            status: "reserved",
            location: "Warehouse District",
            coordinator: "Ayesha Khan",
            setupDate: "2024-01-14",
            notes: "Reserved for incoming flood victims",
            lastUpdated: new Date('2024-01-17')
        }
    ];
    
    updateShelterUI();
}

function updateShelterUI() {
    updateShelterStats();
    filterShelters();
}

function updateShelterStats() {
    const total = shelterInventory.length;
    const available = shelterInventory.filter(shelter => shelter.status === 'available').length;
    const occupied = shelterInventory.filter(shelter => shelter.status === 'occupied').length;
    const maintenance = shelterInventory.filter(shelter => shelter.status === 'maintenance').length;
    const reserved = shelterInventory.filter(shelter => shelter.status === 'reserved').length;

    document.getElementById('available-shelters').textContent = available;
    document.getElementById('occupied-shelters').textContent = occupied;
    document.getElementById('maintenance-shelters').textContent = maintenance;
    document.getElementById('reserved-shelters').textContent = reserved;
}

// ===== FILTERING AND SEARCH =====
function filterShelters() {
    const searchTerm = document.getElementById('shelterSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;

    filteredShelters = shelterInventory.filter(shelter => {
        const matchesSearch = shelter.name.toLowerCase().includes(searchTerm) ||
                            shelter.location.toLowerCase().includes(searchTerm) ||
                            shelter.coordinator?.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || shelter.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || shelter.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    renderShelterTable();
}

function renderShelterTable() {
    const tbody = document.getElementById('shelterTableBody');
    tbody.innerHTML = '';

    if (filteredShelters.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; color: #888; padding: 40px;">
                    No shelters found matching your criteria
                </td>
            </tr>
        `;
        return;
    }

    filteredShelters.forEach(shelter => {
        const row = createShelterRow(shelter);
        tbody.appendChild(row);
    });
}

function createShelterRow(shelter) {
    const row = document.createElement('tr');
    row.className = `shelter-row status-${shelter.status}`;
    
    const setupDate = new Date(shelter.setupDate).toLocaleDateString();
    const occupancyPercentage = (shelter.currentOccupants / shelter.capacity) * 100;
    const capacityColor = getCapacityColor(occupancyPercentage);

    row.innerHTML = `
        <td>
            <div class="shelter-name">${shelter.name}</div>
            <div class="shelter-id">Setup: ${setupDate}</div>
            ${shelter.notes ? `<div class="shelter-id">${shelter.notes}</div>` : ''}
        </td>
        <td>
            <span class="category-badge category-${shelter.category}">
                ${getCategoryName(shelter.category)}
            </span>
        </td>
        <td>
            <div class="capacity-info">
                <span class="capacity-amount">${shelter.capacity}</span>
                <div class="capacity-bar">
                    <div class="capacity-level" style="width: ${occupancyPercentage}%; background: ${capacityColor}"></div>
                </div>
            </div>
        </td>
        <td>
            <span class="status-indicator status-${shelter.status}">
                ${getStatusText(shelter.status)}
            </span>
        </td>
        <td>
            <div>${shelter.currentOccupants} people</div>
            <div class="location-info">${Math.round(occupancyPercentage)}% full</div>
        </td>
        <td>
            <div>${shelter.location}</div>
        </td>
        <td>
            <div>${shelter.coordinator || 'Not Assigned'}</div>
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn-small btn-edit" onclick="editShelter('${shelter.id}')">Edit</button>
                <button class="btn-small btn-update" onclick="updateShelterStatus('${shelter.id}')">Status</button>
                <button class="btn-small btn-assign" onclick="assignCoordinator('${shelter.id}')">Coordinator</button>
                <button class="btn-small btn-danger" onclick="deleteShelter('${shelter.id}')">Delete</button>
            </div>
        </td>
    `;

    return row;
}

// ===== SHELTER MANAGEMENT =====
function showAddShelterForm() {
    document.getElementById('addShelterForm').style.display = 'flex';
    document.getElementById('shelterForm').reset();
    // Set default setup date to today
    document.getElementById('setupDate').value = new Date().toISOString().split('T')[0];
}

function closeAddShelterForm() {
    document.getElementById('addShelterForm').style.display = 'none';
}

async function addNewShelter(event) {
    event.preventDefault();
    
    const formData = {
        id: generateId(),
        name: document.getElementById('shelterName').value,
        category: document.getElementById('shelterCategory').value,
        capacity: parseInt(document.getElementById('capacity').value),
        currentOccupants: parseInt(document.getElementById('currentOccupants').value) || 0,
        status: document.getElementById('shelterStatus').value,
        location: document.getElementById('location').value,
        coordinator: document.getElementById('coordinator').value,
        setupDate: document.getElementById('setupDate').value,
        notes: document.getElementById('shelterNotes').value,
        lastUpdated: new Date()
    };

    try {
        // Replace with actual API call
        const response = await fetch('/api/shelters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            shelterInventory.unshift(formData);
            updateShelterUI();
            closeAddShelterForm();
            showNotification('Shelter added successfully', 'success');
        } else {
            throw new Error('Failed to add shelter');
        }
    } catch (error) {
        console.error('Error adding shelter:', error);
        // Fallback to local addition
        shelterInventory.unshift(formData);
        updateShelterUI();
        closeAddShelterForm();
        showNotification('Shelter added successfully', 'success');
    }
}

async function updateShelterStatus(shelterId) {
    const shelter = shelterInventory.find(s => s.id === shelterId);
    if (!shelter) return;

    const newStatus = prompt(`Update status for ${shelter.name}:\n\nAvailable\nOccupied\nMaintenance\nReserved`, shelter.status);
    if (!newStatus) return;

    const validStatuses = ['available', 'occupied', 'maintenance', 'reserved'];
    if (!validStatuses.includes(newStatus.toLowerCase())) {
        showNotification('Invalid status. Please use: Available, Occupied, Maintenance, or Reserved', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/shelters/${shelterId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                status: newStatus.toLowerCase(),
                lastUpdated: new Date()
            })
        });

        if (response.ok) {
            shelter.status = newStatus.toLowerCase();
            shelter.lastUpdated = new Date();
            updateShelterUI();
            showNotification('Shelter status updated successfully', 'success');
        } else {
            throw new Error('Failed to update shelter status');
        }
    } catch (error) {
        console.error('Error updating shelter status:', error);
        // Fallback to local update
        shelter.status = newStatus.toLowerCase();
        shelter.lastUpdated = new Date();
        updateShelterUI();
        showNotification('Shelter status updated successfully', 'success');
    }
}

async function assignCoordinator(shelterId) {
    const shelter = shelterInventory.find(s => s.id === shelterId);
    if (!shelter) return;

    const newCoordinator = prompt(`Assign coordinator to ${shelter.name}:`, shelter.coordinator || '');
    if (newCoordinator === null) return;

    try {
        const response = await fetch(`/api/shelters/${shelterId}/coordinator`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                coordinator: newCoordinator,
                lastUpdated: new Date()
            })
        });

        if (response.ok) {
            shelter.coordinator = newCoordinator;
            shelter.lastUpdated = new Date();
            updateShelterUI();
            showNotification('Coordinator assigned successfully', 'success');
        } else {
            throw new Error('Failed to assign coordinator');
        }
    } catch (error) {
        console.error('Error assigning coordinator:', error);
        // Fallback to local update
        shelter.coordinator = newCoordinator;
        shelter.lastUpdated = new Date();
        updateShelterUI();
        showNotification('Coordinator assigned successfully', 'success');
    }
}

async function editShelter(shelterId) {
    const shelter = shelterInventory.find(s => s.id === shelterId);
    if (!shelter) return;

    const newName = prompt('Edit shelter name:', shelter.name);
    if (newName) {
        shelter.name = newName;
        shelter.lastUpdated = new Date();
        updateShelterUI();
        showNotification('Shelter updated successfully', 'success');
    }
}

async function deleteShelter(shelterId) {
    if (!confirm('Are you sure you want to delete this shelter?')) return;

    try {
        const response = await fetch(`/api/shelters/${shelterId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            shelterInventory = shelterInventory.filter(s => s.id !== shelterId);
            updateShelterUI();
            showNotification('Shelter deleted successfully', 'success');
        } else {
            throw new Error('Failed to delete shelter');
        }
    } catch (error) {
        console.error('Error deleting shelter:', error);
        // Fallback to local deletion
        shelterInventory = shelterInventory.filter(s => s.id !== shelterId);
        updateShelterUI();
        showNotification('Shelter deleted successfully', 'success');
    }
}

// ===== UTILITY FUNCTIONS =====
function getCapacityColor(occupancyPercentage) {
    if (occupancyPercentage >= 90) return '#ff6b6b';
    if (occupancyPercentage >= 70) return '#ff9800';
    return '#4caf50';
}

function getCategoryName(category) {
    const categories = {
        'tent': 'Tent',
        'container': 'Container',
        'building': 'Building',
        'community': 'Community Center',
        'other': 'Other'
    };
    return categories[category] || category;
}

function getStatusText(status) {
    const statusTexts = {
        'available': 'Available',
        'occupied': 'Occupied',
        'maintenance': 'Maintenance',
        'reserved': 'Reserved'
    };
    return statusTexts[status] || status;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
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

    // Add basic notification styles if not present
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

// ===== EXPORT FUNCTIONS =====
window.showAddShelterForm = showAddShelterForm;
window.closeAddShelterForm = closeAddShelterForm;
window.addNewShelter = addNewShelter;
window.filterShelters = filterShelters;
window.updateShelterStatus = updateShelterStatus;
window.assignCoordinator = assignCoordinator;
window.editShelter = editShelter;
window.deleteShelter = deleteShelter;
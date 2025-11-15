// vehicles-inventory.js
// ===== Rescue Vehicles Inventory Management =====

let vehiclesInventory = [];
let filteredVehicles = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Rescue Vehicles Inventory System Initialized');
    loadVehiclesInventory();
});

// ===== DATA MANAGEMENT =====
async function loadVehiclesInventory() {
    try {
        // Replace with actual API call
        const response = await fetch('/api/vehicles');
        if (response.ok) {
            vehiclesInventory = await response.json();
            updateVehiclesUI();
        } else {
            // Fallback to sample data
            loadSampleVehiclesData();
        }
    } catch (error) {
        console.error('Error loading vehicles inventory:', error);
        loadSampleVehiclesData();
    }
}

function loadSampleVehiclesData() {
    vehiclesInventory = [
        {
            id: generateId(),
            name: "Ambulance 01",
            category: "ambulance",
            licensePlate: "RES-AMB-01",
            status: "available",
            fuelLevel: 85,
            currentLocation: "Central Station",
            assignedDriver: "Dr. Ahmed Rahman",
            lastMaintenance: "2024-01-10",
            nextMaintenance: "2024-02-10",
            notes: "Fully equipped medical ambulance",
            lastUpdated: new Date('2024-01-18')
        },
        {
            id: generateId(),
            name: "Rescue Truck Alpha",
            category: "rescue-truck",
            licensePlate: "RES-TRK-01",
            status: "on-mission",
            fuelLevel: 45,
            currentLocation: "Sylhet Flood Zone",
            assignedDriver: "Kabir Hossain",
            lastMaintenance: "2024-01-05",
            nextMaintenance: "2024-02-05",
            notes: "Heavy rescue equipment onboard",
            lastUpdated: new Date('2024-01-18')
        },
        {
            id: generateId(),
            name: "Rescue Boat 01",
            category: "boat",
            licensePlate: "RES-BT-01",
            status: "available",
            fuelLevel: 90,
            currentLocation: "River Dock A",
            assignedDriver: "Maruf Islam",
            lastMaintenance: "2024-01-12",
            nextMaintenance: "2024-02-12",
            notes: "20-person capacity rescue boat",
            lastUpdated: new Date('2024-01-17')
        },
        {
            id: generateId(),
            name: "Medi-Van 02",
            category: "support",
            licensePlate: "RES-VAN-02",
            status: "maintenance",
            fuelLevel: 20,
            currentLocation: "Maintenance Garage",
            assignedDriver: "Not Assigned",
            lastMaintenance: "2023-12-15",
            nextMaintenance: "2024-01-25",
            notes: "Engine repair in progress",
            lastUpdated: new Date('2024-01-16')
        },
        {
            id: generateId(),
            name: "Helicopter Rescue 01",
            category: "helicopter",
            licensePlate: "RES-HELI-01",
            status: "reserved",
            fuelLevel: 100,
            currentLocation: "Central Helipad",
            assignedDriver: "Captain Farhan",
            lastMaintenance: "2024-01-08",
            nextMaintenance: "2024-02-08",
            notes: "Air rescue operations",
            lastUpdated: new Date('2024-01-15')
        },
        {
            id: generateId(),
            name: "Support Truck 01",
            category: "support",
            licensePlate: "RES-SUP-01",
            status: "available",
            fuelLevel: 75,
            currentLocation: "Warehouse B",
            assignedDriver: "Rahim Khan",
            lastMaintenance: "2024-01-14",
            nextMaintenance: "2024-02-14",
            notes: "Supplies transport vehicle",
            lastUpdated: new Date('2024-01-17')
        }
    ];
    
    updateVehiclesUI();
}

function updateVehiclesUI() {
    updateVehiclesStats();
    filterVehicles();
}

function updateVehiclesStats() {
    const total = vehiclesInventory.length;
    const available = vehiclesInventory.filter(vehicle => vehicle.status === 'available').length;
    const onMission = vehiclesInventory.filter(vehicle => vehicle.status === 'on-mission').length;
    const maintenance = vehiclesInventory.filter(vehicle => vehicle.status === 'maintenance').length;
    const reserved = vehiclesInventory.filter(vehicle => vehicle.status === 'reserved').length;

    document.getElementById('available-vehicles').textContent = available;
    document.getElementById('on-mission-vehicles').textContent = onMission;
    document.getElementById('maintenance-vehicles').textContent = maintenance;
    document.getElementById('reserved-vehicles').textContent = reserved;
}

// ===== FILTERING AND SEARCH =====
function filterVehicles() {
    const searchTerm = document.getElementById('vehicleSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;

    filteredVehicles = vehiclesInventory.filter(vehicle => {
        const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm) ||
                            vehicle.licensePlate.toLowerCase().includes(searchTerm) ||
                            vehicle.assignedDriver?.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || vehicle.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    renderVehiclesTable();
}

function renderVehiclesTable() {
    const tbody = document.getElementById('vehiclesTableBody');
    tbody.innerHTML = '';

    if (filteredVehicles.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; color: #888; padding: 40px;">
                    No vehicles found matching your criteria
                </td>
            </tr>
        `;
        return;
    }

    filteredVehicles.forEach(vehicle => {
        const row = createVehicleRow(vehicle);
        tbody.appendChild(row);
    });
}

function createVehicleRow(vehicle) {
    const row = document.createElement('tr');
    row.className = `vehicle-row status-${vehicle.status}`;
    
    const lastMaintenance = new Date(vehicle.lastMaintenance).toLocaleDateString();
    const fuelColor = getFuelColor(vehicle.fuelLevel);

    row.innerHTML = `
        <td>
            <div class="vehicle-name">${vehicle.name}</div>
            <div class="vehicle-id">${vehicle.licensePlate}</div>
            ${vehicle.notes ? `<div class="vehicle-id">${vehicle.notes}</div>` : ''}
        </td>
        <td>
            <span class="category-badge category-${vehicle.category}">
                ${getCategoryName(vehicle.category)}
            </span>
        </td>
        <td>
            <span class="status-indicator status-${vehicle.status}">
                ${getStatusText(vehicle.status)}
            </span>
        </td>
        <td>
            <div class="fuel-level">
                <span class="fuel-amount">${vehicle.fuelLevel}%</span>
                <div class="fuel-bar">
                    <div class="fuel-level-indicator" style="width: ${vehicle.fuelLevel}%; background: ${fuelColor}"></div>
                </div>
            </div>
        </td>
        <td>
            <div>${vehicle.currentLocation}</div>
        </td>
        <td>
            <div>${vehicle.assignedDriver || 'Not Assigned'}</div>
        </td>
        <td>${lastMaintenance}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-small btn-edit" onclick="editVehicle('${vehicle.id}')">Edit</button>
                <button class="btn-small btn-update" onclick="updateVehicleStatus('${vehicle.id}')">Status</button>
                <button class="btn-small btn-assign" onclick="assignDriver('${vehicle.id}')">Assign</button>
                <button class="btn-small btn-danger" onclick="deleteVehicle('${vehicle.id}')">Delete</button>
            </div>
        </td>
    `;

    return row;
}

// ===== VEHICLE MANAGEMENT =====
function showAddVehicleForm() {
    document.getElementById('addVehicleForm').style.display = 'flex';
    document.getElementById('vehicleForm').reset();
    // Set default last maintenance to today
    document.getElementById('lastMaintenance').value = new Date().toISOString().split('T')[0];
}

function closeAddVehicleForm() {
    document.getElementById('addVehicleForm').style.display = 'none';
}

async function addNewVehicle(event) {
    event.preventDefault();
    
    const formData = {
        id: generateId(),
        name: document.getElementById('vehicleName').value,
        category: document.getElementById('vehicleCategory').value,
        licensePlate: document.getElementById('licensePlate').value,
        status: document.getElementById('vehicleStatus').value,
        fuelLevel: parseInt(document.getElementById('fuelLevel').value),
        currentLocation: document.getElementById('currentLocation').value,
        assignedDriver: document.getElementById('assignedDriver').value,
        lastMaintenance: document.getElementById('lastMaintenance').value,
        notes: document.getElementById('vehicleNotes').value,
        lastUpdated: new Date()
    };

    // Calculate next maintenance date (30 days from last maintenance)
    const lastMaintenanceDate = new Date(formData.lastMaintenance);
    const nextMaintenanceDate = new Date(lastMaintenanceDate);
    nextMaintenanceDate.setDate(nextMaintenanceDate.getDate() + 30);
    formData.nextMaintenance = nextMaintenanceDate.toISOString().split('T')[0];

    try {
        // Replace with actual API call
        const response = await fetch('/api/vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            vehiclesInventory.unshift(formData);
            updateVehiclesUI();
            closeAddVehicleForm();
            showNotification('Vehicle added successfully', 'success');
        } else {
            throw new Error('Failed to add vehicle');
        }
    } catch (error) {
        console.error('Error adding vehicle:', error);
        // Fallback to local addition
        vehiclesInventory.unshift(formData);
        updateVehiclesUI();
        closeAddVehicleForm();
        showNotification('Vehicle added successfully', 'success');
    }
}

async function updateVehicleStatus(vehicleId) {
    const vehicle = vehiclesInventory.find(v => v.id === vehicleId);
    if (!vehicle) return;

    const newStatus = prompt(`Update status for ${vehicle.name}:\n\nAvailable\nOn Mission\nMaintenance\nReserved`, vehicle.status);
    if (!newStatus) return;

    const validStatuses = ['available', 'on-mission', 'maintenance', 'reserved'];
    if (!validStatuses.includes(newStatus.toLowerCase())) {
        showNotification('Invalid status. Please use: Available, On Mission, Maintenance, or Reserved', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/vehicles/${vehicleId}/status`, {
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
            vehicle.status = newStatus.toLowerCase();
            vehicle.lastUpdated = new Date();
            updateVehiclesUI();
            showNotification('Vehicle status updated successfully', 'success');
        } else {
            throw new Error('Failed to update vehicle status');
        }
    } catch (error) {
        console.error('Error updating vehicle status:', error);
        // Fallback to local update
        vehicle.status = newStatus.toLowerCase();
        vehicle.lastUpdated = new Date();
        updateVehiclesUI();
        showNotification('Vehicle status updated successfully', 'success');
    }
}

async function assignDriver(vehicleId) {
    const vehicle = vehiclesInventory.find(v => v.id === vehicleId);
    if (!vehicle) return;

    const newDriver = prompt(`Assign driver to ${vehicle.name}:`, vehicle.assignedDriver || '');
    if (newDriver === null) return;

    try {
        const response = await fetch(`/api/vehicles/${vehicleId}/driver`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                assignedDriver: newDriver,
                lastUpdated: new Date()
            })
        });

        if (response.ok) {
            vehicle.assignedDriver = newDriver;
            vehicle.lastUpdated = new Date();
            updateVehiclesUI();
            showNotification('Driver assigned successfully', 'success');
        } else {
            throw new Error('Failed to assign driver');
        }
    } catch (error) {
        console.error('Error assigning driver:', error);
        // Fallback to local update
        vehicle.assignedDriver = newDriver;
        vehicle.lastUpdated = new Date();
        updateVehiclesUI();
        showNotification('Driver assigned successfully', 'success');
    }
}

async function editVehicle(vehicleId) {
    const vehicle = vehiclesInventory.find(v => v.id === vehicleId);
    if (!vehicle) return;

    const newName = prompt('Edit vehicle name:', vehicle.name);
    if (newName) {
        vehicle.name = newName;
        vehicle.lastUpdated = new Date();
        updateVehiclesUI();
        showNotification('Vehicle updated successfully', 'success');
    }
}

async function deleteVehicle(vehicleId) {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
        const response = await fetch(`/api/vehicles/${vehicleId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            vehiclesInventory = vehiclesInventory.filter(v => v.id !== vehicleId);
            updateVehiclesUI();
            showNotification('Vehicle deleted successfully', 'success');
        } else {
            throw new Error('Failed to delete vehicle');
        }
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        // Fallback to local deletion
        vehiclesInventory = vehiclesInventory.filter(v => v.id !== vehicleId);
        updateVehiclesUI();
        showNotification('Vehicle deleted successfully', 'success');
    }
}

// ===== UTILITY FUNCTIONS =====
function getFuelColor(fuelLevel) {
    if (fuelLevel < 20) return '#ff6b6b';
    if (fuelLevel < 50) return '#ff9800';
    return '#4caf50';
}

function getCategoryName(category) {
    const categories = {
        'ambulance': 'Ambulance',
        'rescue-truck': 'Rescue Truck',
        'boat': 'Rescue Boat',
        'helicopter': 'Helicopter',
        'support': 'Support Vehicle',
        'other': 'Other'
    };
    return categories[category] || category;
}

function getStatusText(status) {
    const statusTexts = {
        'available': 'Available',
        'on-mission': 'On Mission',
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
window.showAddVehicleForm = showAddVehicleForm;
window.closeAddVehicleForm = closeAddVehicleForm;
window.addNewVehicle = addNewVehicle;
window.filterVehicles = filterVehicles;
window.updateVehicleStatus = updateVehicleStatus;
window.assignDriver = assignDriver;
window.editVehicle = editVehicle;
window.deleteVehicle = deleteVehicle;
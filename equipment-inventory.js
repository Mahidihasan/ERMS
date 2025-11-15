// equipment-inventory.js
// ===== Emergency Equipment Inventory Management =====

let equipmentInventory = [];
let filteredEquipment = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Emergency Equipment Inventory System Initialized');
    loadEquipmentInventory();
});

// ===== DATA MANAGEMENT =====
async function loadEquipmentInventory() {
    try {
        // Replace with actual API call
        const response = await fetch('/api/equipment');
        if (response.ok) {
            equipmentInventory = await response.json();
            updateEquipmentUI();
        } else {
            // Fallback to sample data
            loadSampleEquipmentData();
        }
    } catch (error) {
        console.error('Error loading equipment inventory:', error);
        loadSampleEquipmentData();
    }
}

function loadSampleEquipmentData() {
    equipmentInventory = [
        {
            id: generateId(),
            name: "Rescue Boat - 20 Person",
            category: "rescue",
            currentStock: 3,
            minimumStock: 2,
            status: "available",
            condition: "excellent",
            storageLocation: "River Dock Storage",
            lastTested: "2024-01-15",
            nextTest: "2024-04-15",
            notes: "20-person capacity with motor",
            lastUpdated: new Date('2024-01-18')
        },
        {
            id: generateId(),
            name: "Portable Generator 5kW",
            category: "power",
            currentStock: 8,
            minimumStock: 5,
            status: "in-use",
            condition: "good",
            storageLocation: "Field Operations",
            lastTested: "2024-01-10",
            nextTest: "2024-02-10",
            notes: "Diesel powered, 5kW output",
            lastUpdated: new Date('2024-01-18')
        },
        {
            id: generateId(),
            name: "Satellite Phone Set",
            category: "communication",
            currentStock: 5,
            minimumStock: 3,
            status: "available",
            condition: "excellent",
            storageLocation: "Comm Center",
            lastTested: "2024-01-12",
            nextTest: "2024-04-12",
            notes: "Emergency communication",
            lastUpdated: new Date('2024-01-17')
        },
        {
            id: generateId(),
            name: "Medical Ventilator",
            category: "medical",
            currentStock: 2,
            minimumStock: 4,
            status: "maintenance",
            condition: "fair",
            storageLocation: "Medical Storage",
            lastTested: "2024-01-05",
            nextTest: "2024-02-05",
            notes: "One unit under repair",
            lastUpdated: new Date('2024-01-16')
        },
        {
            id: generateId(),
            name: "Water Purification Unit",
            category: "rescue",
            currentStock: 4,
            minimumStock: 3,
            status: "reserved",
            condition: "good",
            storageLocation: "Warehouse B",
            lastTested: "2024-01-14",
            nextTest: "2024-04-14",
            notes: "Reserved for flood zone deployment",
            lastUpdated: new Date('2024-01-18')
        },
        {
            id: generateId(),
            name: "Safety Helmets",
            category: "safety",
            currentStock: 45,
            minimumStock: 50,
            status: "available",
            condition: "good",
            storageLocation: "Safety Gear Locker",
            lastTested: "2024-01-08",
            nextTest: "2024-07-08",
            notes: "Various sizes available",
            lastUpdated: new Date('2024-01-17')
        },
        {
            id: generateId(),
            name: "Emergency Lighting Kit",
            category: "power",
            currentStock: 12,
            minimumStock: 10,
            status: "in-use",
            condition: "fair",
            storageLocation: "Field Operations",
            lastTested: "2024-01-11",
            nextTest: "2024-04-11",
            notes: "LED flood lights with batteries",
            lastUpdated: new Date('2024-01-18')
        }
    ];
    
    updateEquipmentUI();
}

function updateEquipmentUI() {
    updateEquipmentStats();
    filterEquipment();
}

function updateEquipmentStats() {
    const total = equipmentInventory.length;
    const available = equipmentInventory.filter(eq => eq.status === 'available').length;
    const inUse = equipmentInventory.filter(eq => eq.status === 'in-use').length;
    const maintenance = equipmentInventory.filter(eq => eq.status === 'maintenance').length;
    const reserved = equipmentInventory.filter(eq => eq.status === 'reserved').length;

    document.getElementById('available-equipment').textContent = available;
    document.getElementById('in-use-equipment').textContent = inUse;
    document.getElementById('maintenance-equipment').textContent = maintenance;
    document.getElementById('reserved-equipment').textContent = reserved;
}

// ===== FILTERING AND SEARCH =====
function filterEquipment() {
    const searchTerm = document.getElementById('equipmentSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;

    filteredEquipment = equipmentInventory.filter(equipment => {
        const matchesSearch = equipment.name.toLowerCase().includes(searchTerm) ||
                            equipment.storageLocation.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || equipment.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || equipment.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    renderEquipmentTable();
}

function renderEquipmentTable() {
    const tbody = document.getElementById('equipmentTableBody');
    tbody.innerHTML = '';

    if (filteredEquipment.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; color: #888; padding: 40px;">
                    No equipment found matching your criteria
                </td>
            </tr>
        `;
        return;
    }

    filteredEquipment.forEach(equipment => {
        const row = createEquipmentRow(equipment);
        tbody.appendChild(row);
    });
}

function createEquipmentRow(equipment) {
    const row = document.createElement('tr');
    row.className = `equipment-row status-${equipment.status}`;
    
    const lastTested = new Date(equipment.lastTested).toLocaleDateString();
    const stockPercentage = calculateStockPercentage(equipment);
    const stockColor = getStockColor(stockPercentage);

    row.innerHTML = `
        <td>
            <div class="equipment-name">${equipment.name}</div>
            ${equipment.notes ? `<div class="equipment-id">${equipment.notes}</div>` : ''}
        </td>
        <td>
            <span class="category-badge category-${equipment.category}">
                ${getCategoryName(equipment.category)}
            </span>
        </td>
        <td>
            <div class="stock-info">
                <span class="stock-amount">${equipment.currentStock}</span>
                <div class="stock-bar">
                    <div class="stock-level" style="width: ${stockPercentage}%; background: ${stockColor}"></div>
                </div>
            </div>
        </td>
        <td>
            <span class="status-indicator status-${equipment.status}">
                ${getStatusText(equipment.status)}
            </span>
        </td>
        <td>
            <span class="condition-indicator condition-${equipment.condition}">
                ${getConditionText(equipment.condition)}
            </span>
        </td>
        <td>
            <div>${equipment.storageLocation}</div>
        </td>
        <td>
            <div>${lastTested}</div>
            ${equipment.nextTest ? `<div class="last-tested">Next: ${new Date(equipment.nextTest).toLocaleDateString()}</div>` : ''}
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn-small btn-edit" onclick="editEquipment('${equipment.id}')">Edit</button>
                <button class="btn-small btn-update" onclick="updateEquipmentStatus('${equipment.id}')">Status</button>
                <button class="btn-small btn-test" onclick="markAsTested('${equipment.id}')">Test</button>
                <button class="btn-small btn-danger" onclick="deleteEquipment('${equipment.id}')">Delete</button>
            </div>
        </td>
    `;

    return row;
}

// ===== EQUIPMENT MANAGEMENT =====
function showAddEquipmentForm() {
    document.getElementById('addEquipmentForm').style.display = 'flex';
    document.getElementById('equipmentForm').reset();
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('lastTested').value = today;
    
    // Set next test to 3 months from now
    const nextTest = new Date();
    nextTest.setMonth(nextTest.getMonth() + 3);
    document.getElementById('nextTest').value = nextTest.toISOString().split('T')[0];
}

function closeAddEquipmentForm() {
    document.getElementById('addEquipmentForm').style.display = 'none';
}

async function addNewEquipment(event) {
    event.preventDefault();
    
    const formData = {
        id: generateId(),
        name: document.getElementById('equipmentName').value,
        category: document.getElementById('equipmentCategory').value,
        currentStock: parseInt(document.getElementById('currentStock').value),
        minimumStock: parseInt(document.getElementById('minimumStock').value),
        status: document.getElementById('equipmentStatus').value,
        condition: document.getElementById('condition').value,
        storageLocation: document.getElementById('storageLocation').value,
        lastTested: document.getElementById('lastTested').value,
        nextTest: document.getElementById('nextTest').value,
        notes: document.getElementById('equipmentNotes').value,
        lastUpdated: new Date()
    };

    try {
        // Replace with actual API call
        const response = await fetch('/api/equipment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            equipmentInventory.unshift(formData);
            updateEquipmentUI();
            closeAddEquipmentForm();
            showNotification('Equipment added successfully', 'success');
        } else {
            throw new Error('Failed to add equipment');
        }
    } catch (error) {
        console.error('Error adding equipment:', error);
        // Fallback to local addition
        equipmentInventory.unshift(formData);
        updateEquipmentUI();
        closeAddEquipmentForm();
        showNotification('Equipment added successfully', 'success');
    }
}

async function updateEquipmentStatus(equipmentId) {
    const equipment = equipmentInventory.find(e => e.id === equipmentId);
    if (!equipment) return;

    const newStatus = prompt(`Update status for ${equipment.name}:\n\nAvailable\nIn Use\nMaintenance\nReserved`, equipment.status);
    if (!newStatus) return;

    const validStatuses = ['available', 'in-use', 'maintenance', 'reserved'];
    if (!validStatuses.includes(newStatus.toLowerCase())) {
        showNotification('Invalid status. Please use: Available, In Use, Maintenance, or Reserved', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/equipment/${equipmentId}/status`, {
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
            equipment.status = newStatus.toLowerCase();
            equipment.lastUpdated = new Date();
            updateEquipmentUI();
            showNotification('Equipment status updated successfully', 'success');
        } else {
            throw new Error('Failed to update equipment status');
        }
    } catch (error) {
        console.error('Error updating equipment status:', error);
        // Fallback to local update
        equipment.status = newStatus.toLowerCase();
        equipment.lastUpdated = new Date();
        updateEquipmentUI();
        showNotification('Equipment status updated successfully', 'success');
    }
}

async function markAsTested(equipmentId) {
    const equipment = equipmentInventory.find(e => e.id === equipmentId);
    if (!equipment) return;

    const today = new Date().toISOString().split('T')[0];
    const nextTest = new Date();
    nextTest.setMonth(nextTest.getMonth() + 3); // Next test in 3 months

    try {
        const response = await fetch(`/api/equipment/${equipmentId}/test`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                lastTested: today,
                nextTest: nextTest.toISOString().split('T')[0],
                lastUpdated: new Date()
            })
        });

        if (response.ok) {
            equipment.lastTested = today;
            equipment.nextTest = nextTest.toISOString().split('T')[0];
            equipment.lastUpdated = new Date();
            updateEquipmentUI();
            showNotification('Equipment marked as tested', 'success');
        } else {
            throw new Error('Failed to update test date');
        }
    } catch (error) {
        console.error('Error updating test date:', error);
        // Fallback to local update
        equipment.lastTested = today;
        equipment.nextTest = nextTest.toISOString().split('T')[0];
        equipment.lastUpdated = new Date();
        updateEquipmentUI();
        showNotification('Equipment marked as tested', 'success');
    }
}

async function editEquipment(equipmentId) {
    const equipment = equipmentInventory.find(e => e.id === equipmentId);
    if (!equipment) return;

    const newName = prompt('Edit equipment name:', equipment.name);
    if (newName) {
        equipment.name = newName;
        equipment.lastUpdated = new Date();
        updateEquipmentUI();
        showNotification('Equipment updated successfully', 'success');
    }
}

async function deleteEquipment(equipmentId) {
    if (!confirm('Are you sure you want to delete this equipment?')) return;

    try {
        const response = await fetch(`/api/equipment/${equipmentId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            equipmentInventory = equipmentInventory.filter(e => e.id !== equipmentId);
            updateEquipmentUI();
            showNotification('Equipment deleted successfully', 'success');
        } else {
            throw new Error('Failed to delete equipment');
        }
    } catch (error) {
        console.error('Error deleting equipment:', error);
        // Fallback to local deletion
        equipmentInventory = equipmentInventory.filter(e => e.id !== equipmentId);
        updateEquipmentUI();
        showNotification('Equipment deleted successfully', 'success');
    }
}

// ===== UTILITY FUNCTIONS =====
function calculateStockPercentage(equipment) {
    const maxStock = Math.max(equipment.currentStock, equipment.minimumStock * 2);
    return (equipment.currentStock / maxStock) * 100;
}

function getStockColor(percentage) {
    if (percentage < 30) return '#ff6b6b';
    if (percentage < 70) return '#ff9800';
    return '#4caf50';
}

function getCategoryName(category) {
    const categories = {
        'rescue': 'Rescue Equipment',
        'medical': 'Medical Equipment',
        'communication': 'Communication',
        'power': 'Power & Lighting',
        'safety': 'Safety Gear',
        'other': 'Other'
    };
    return categories[category] || category;
}

function getStatusText(status) {
    const statusTexts = {
        'available': 'Available',
        'in-use': 'In Use',
        'maintenance': 'Maintenance',
        'reserved': 'Reserved'
    };
    return statusTexts[status] || status;
}

function getConditionText(condition) {
    const conditionTexts = {
        'excellent': 'Excellent',
        'good': 'Good',
        'fair': 'Fair',
        'poor': 'Poor'
    };
    return conditionTexts[condition] || condition;
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
window.showAddEquipmentForm = showAddEquipmentForm;
window.closeAddEquipmentForm = closeAddEquipmentForm;
window.addNewEquipment = addNewEquipment;
window.filterEquipment = filterEquipment;
window.updateEquipmentStatus = updateEquipmentStatus;
window.markAsTested = markAsTested;
window.editEquipment = editEquipment;
window.deleteEquipment = deleteEquipment;
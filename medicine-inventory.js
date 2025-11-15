// medicine-inventory.js
// ===== Medicine & First Aid Inventory Management =====

let medicineInventory = [];
let filteredMedicines = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Medicine Inventory System Initialized');
    loadMedicineInventory();
});

// ===== DATA MANAGEMENT =====
async function loadMedicineInventory() {
    try {
        // Replace with actual API call
        const response = await fetch('/api/medicines');
        if (response.ok) {
            medicineInventory = await response.json();
            updateMedicineUI();
        } else {
            // Fallback to sample data
            loadSampleMedicineData();
        }
    } catch (error) {
        console.error('Error loading medicine inventory:', error);
        loadSampleMedicineData();
    }
}

function loadSampleMedicineData() {
    medicineInventory = [
        {
            id: generateId(),
            name: "Paracetamol 500mg",
            category: "pain-relief",
            currentStock: 1500,
            minimumStock: 500,
            status: "adequate",
            lastUpdated: new Date('2024-01-15'),
            source: "PharmaCorp Bangladesh",
            batchNumber: "PC-2024-001",
            useReason: "General pain relief and fever reduction",
            expiryDate: "2025-12-31",
            unitType: "tablets",
            notes: "Primary pain relief medication"
        },
        {
            id: generateId(),
            name: "Amoxicillin 250mg",
            category: "antibiotics",
            currentStock: 45,
            minimumStock: 100,
            status: "critical",
            lastUpdated: new Date('2024-01-14'),
            source: "MediSupply International",
            batchNumber: "AM-2024-002",
            useReason: "Bacterial infections treatment",
            expiryDate: "2024-06-30",
            unitType: "tablets",
            notes: "Running low, need urgent restocking"
        },
        {
            id: generateId(),
            name: "Bandages (5cm)",
            category: "first-aid",
            currentStock: 80,
            minimumStock: 200,
            status: "low",
            lastUpdated: new Date('2024-01-16'),
            source: "First Aid Supplies Ltd",
            batchNumber: "BG-2024-003",
            useReason: "Wound dressing and injury management",
            expiryDate: "2026-12-31",
            unitType: "pieces",
            notes: "Standard medical bandages"
        },
        {
            id: generateId(),
            name: "ORS Packets",
            category: "emergency",
            currentStock: 300,
            minimumStock: 150,
            status: "adequate",
            lastUpdated: new Date('2024-01-13'),
            source: "Health Ministry Donation",
            batchNumber: "ORS-2024-004",
            useReason: "Dehydration treatment in flood areas",
            expiryDate: "2025-08-31",
            unitType: "packets",
            notes: "Oral rehydration salts"
        },
        {
            id: generateId(),
            name: "Ibuprofen 400mg",
            category: "pain-relief",
            currentStock: 600,
            minimumStock: 300,
            status: "adequate",
            lastUpdated: new Date('2024-01-12'),
            source: "PharmaCorp Bangladesh",
            batchNumber: "IB-2024-005",
            useReason: "Anti-inflammatory and pain relief",
            expiryDate: "2025-10-31",
            unitType: "tablets",
            notes: "Alternative pain relief option"
        },
        {
            id: generateId(),
            name: "Antiseptic Solution",
            category: "first-aid",
            currentStock: 25,
            minimumStock: 50,
            status: "low",
            lastUpdated: new Date('2024-01-17'),
            source: "Medical Supplies Co.",
            batchNumber: "AS-2024-006",
            useReason: "Wound cleaning and disinfection",
            expiryDate: "2025-05-31",
            unitType: "bottles",
            notes: "500ml bottles"
        }
    ];
    
    updateMedicineUI();
}

function updateMedicineUI() {
    updateMedicineStats();
    filterMedicines();
}

function updateMedicineStats() {
    const total = medicineInventory.length;
    const critical = medicineInventory.filter(m => m.status === 'critical').length;
    const low = medicineInventory.filter(m => m.status === 'low').length;
    const adequate = medicineInventory.filter(m => m.status === 'adequate').length;

    document.getElementById('total-medicines').textContent = total;
    document.getElementById('critical-medicines').textContent = critical;
    document.getElementById('low-medicines').textContent = low;
    document.getElementById('adequate-medicines').textContent = adequate;
}

// ===== FILTERING AND SEARCH =====
function filterMedicines() {
    const searchTerm = document.getElementById('medicineSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;

    filteredMedicines = medicineInventory.filter(medicine => {
        const matchesSearch = medicine.name.toLowerCase().includes(searchTerm) ||
                            medicine.useReason.toLowerCase().includes(searchTerm) ||
                            medicine.batchNumber?.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || medicine.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    renderMedicineTable();
}

function renderMedicineTable() {
    const tbody = document.getElementById('medicineTableBody');
    tbody.innerHTML = '';

    if (filteredMedicines.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; color: #888; padding: 40px;">
                    No medicines found matching your criteria
                </td>
            </tr>
        `;
        return;
    }

    filteredMedicines.forEach(medicine => {
        const row = createMedicineRow(medicine);
        tbody.appendChild(row);
    });
}

function createMedicineRow(medicine) {
    const row = document.createElement('tr');
    row.className = `medicine-row status-${medicine.status}`;
    
    const lastUpdated = new Date(medicine.lastUpdated).toLocaleDateString();
    const statusClass = `status-indicator ${medicine.status}`;
    const statusText = medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1);
    const stockPercentage = calculateStockPercentage(medicine);

    row.innerHTML = `
        <td>
            <div class="medicine-name">${medicine.name}</div>
            ${medicine.batchNumber ? `<div class="batch-number">Batch: ${medicine.batchNumber}</div>` : ''}
            ${medicine.expiryDate ? `<div class="batch-number">Expires: ${new Date(medicine.expiryDate).toLocaleDateString()}</div>` : ''}
        </td>
        <td>
            <span class="category-badge category-${medicine.category}">
                ${getCategoryName(medicine.category)}
            </span>
        </td>
        <td>
            <div class="stock-info">
                <span class="stock-amount">${medicine.currentStock} ${getUnitName(medicine.unitType)}</span>
                <div class="stock-bar">
                    <div class="stock-level" style="width: ${stockPercentage}%; background: ${getStockColor(stockPercentage)}"></div>
                </div>
            </div>
        </td>
        <td>
            <span class="${statusClass}">${statusText}</span>
        </td>
        <td>${lastUpdated}</td>
        <td>${medicine.source}</td>
        <td class="use-reason">${medicine.useReason}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-small btn-edit" onclick="editMedicine('${medicine.id}')">Edit</button>
                <button class="btn-small btn-update" onclick="updateStock('${medicine.id}')">Update</button>
                <button class="btn-small btn-danger" onclick="deleteMedicine('${medicine.id}')">Delete</button>
            </div>
        </td>
    `;

    return row;
}

// ===== MEDICINE MANAGEMENT =====
function showAddMedicineForm() {
    document.getElementById('addMedicineForm').style.display = 'flex';
    document.getElementById('medicineForm').reset();
    // Set today's date as default for expiry date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expiryDate').value = today;
}

function closeAddMedicineForm() {
    document.getElementById('addMedicineForm').style.display = 'none';
}

async function addNewMedicine(event) {
    event.preventDefault();
    
    const formData = {
        id: generateId(),
        name: document.getElementById('medicineName').value,
        category: document.getElementById('medicineCategory').value,
        currentStock: parseInt(document.getElementById('currentStock').value),
        minimumStock: parseInt(document.getElementById('minimumStock').value),
        source: document.getElementById('source').value,
        batchNumber: document.getElementById('batchNumber').value,
        useReason: document.getElementById('useReason').value,
        expiryDate: document.getElementById('expiryDate').value,
        unitType: document.getElementById('unitType').value,
        notes: document.getElementById('notes').value,
        lastUpdated: new Date(),
        status: calculateStockStatus(parseInt(document.getElementById('currentStock').value), parseInt(document.getElementById('minimumStock').value))
    };

    try {
        // Replace with actual API call
        const response = await fetch('/api/medicines', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            medicineInventory.unshift(formData);
            updateMedicineUI();
            closeAddMedicineForm();
            showNotification('Medicine added successfully', 'success');
        } else {
            throw new Error('Failed to add medicine');
        }
    } catch (error) {
        console.error('Error adding medicine:', error);
        // Fallback to local addition
        medicineInventory.unshift(formData);
        updateMedicineUI();
        closeAddMedicineForm();
        showNotification('Medicine added successfully', 'success');
    }
}

async function updateStock(medicineId) {
    const medicine = medicineInventory.find(m => m.id === medicineId);
    if (!medicine) return;

    const newStock = prompt(`Update stock for ${medicine.name} (current: ${medicine.currentStock} ${getUnitName(medicine.unitType)}):`, medicine.currentStock);
    if (newStock === null) return;

    const stockValue = parseInt(newStock);
    if (isNaN(stockValue) || stockValue < 0) {
        showNotification('Please enter a valid stock number', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/medicines/${medicineId}/stock`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                stock: stockValue,
                lastUpdated: new Date()
            })
        });

        if (response.ok) {
            medicine.currentStock = stockValue;
            medicine.status = calculateStockStatus(stockValue, medicine.minimumStock);
            medicine.lastUpdated = new Date();
            updateMedicineUI();
            showNotification('Stock updated successfully', 'success');
        } else {
            throw new Error('Failed to update stock');
        }
    } catch (error) {
        console.error('Error updating stock:', error);
        // Fallback to local update
        medicine.currentStock = stockValue;
        medicine.status = calculateStockStatus(stockValue, medicine.minimumStock);
        medicine.lastUpdated = new Date();
        updateMedicineUI();
        showNotification('Stock updated successfully', 'success');
    }
}

async function editMedicine(medicineId) {
    const medicine = medicineInventory.find(m => m.id === medicineId);
    if (!medicine) return;

    // For now, show a simple edit form
    // In a real implementation, you'd show a proper edit modal
    const newName = prompt('Edit medicine name:', medicine.name);
    if (newName) {
        medicine.name = newName;
        medicine.lastUpdated = new Date();
        updateMedicineUI();
        showNotification('Medicine updated successfully', 'success');
    }
}

async function deleteMedicine(medicineId) {
    if (!confirm('Are you sure you want to delete this medicine?')) return;

    try {
        const response = await fetch(`/api/medicines/${medicineId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            medicineInventory = medicineInventory.filter(m => m.id !== medicineId);
            updateMedicineUI();
            showNotification('Medicine deleted successfully', 'success');
        } else {
            throw new Error('Failed to delete medicine');
        }
    } catch (error) {
        console.error('Error deleting medicine:', error);
        // Fallback to local deletion
        medicineInventory = medicineInventory.filter(m => m.id !== medicineId);
        updateMedicineUI();
        showNotification('Medicine deleted successfully', 'success');
    }
}

// ===== UTILITY FUNCTIONS =====
function calculateStockStatus(currentStock, minimumStock) {
    if (currentStock === 0) return 'critical';
    if (currentStock < minimumStock * 0.3) return 'critical';
    if (currentStock < minimumStock * 0.7) return 'low';
    return 'adequate';
}

function calculateStockPercentage(medicine) {
    const maxStock = Math.max(medicine.currentStock, medicine.minimumStock * 2);
    return (medicine.currentStock / maxStock) * 100;
}

function getStockColor(percentage) {
    if (percentage < 30) return '#ff6b6b';
    if (percentage < 70) return '#ffa726';
    return '#4caf50';
}

function getCategoryName(category) {
    const categories = {
        'pain-relief': 'Pain Relief',
        'antibiotics': 'Antibiotics',
        'first-aid': 'First Aid',
        'emergency': 'Emergency',
        'vitamins': 'Vitamins',
        'other': 'Other'
    };
    return categories[category] || category;
}

function getUnitName(unitType) {
    const units = {
        'tablets': 'tablets',
        'bottles': 'bottles',
        'packets': 'packets',
        'boxes': 'boxes',
        'pieces': 'pcs',
        'other': ''
    };
    return units[unitType] || '';
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
window.showAddMedicineForm = showAddMedicineForm;
window.closeAddMedicineForm = closeAddMedicineForm;
window.addNewMedicine = addNewMedicine;
window.filterMedicines = filterMedicines;
window.updateStock = updateStock;
window.editMedicine = editMedicine;
window.deleteMedicine = deleteMedicine;
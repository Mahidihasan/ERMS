// food-inventory.js
// ===== Food & Water Inventory Management =====

let foodInventory = [];
let filteredFoodItems = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Food & Water Inventory System Initialized');
    loadFoodInventory();
});

// ===== DATA MANAGEMENT =====
async function loadFoodInventory() {
    try {
        // Replace with actual API call
        const response = await fetch('/api/food-items');
        if (response.ok) {
            foodInventory = await response.json();
            updateFoodUI();
        } else {
            // Fallback to sample data
            loadSampleFoodData();
        }
    } catch (error) {
        console.error('Error loading food inventory:', error);
        loadSampleFoodData();
    }
}

function loadSampleFoodData() {
    foodInventory = [
        {
            id: generateId(),
            name: "Rice (5kg bags)",
            category: "food",
            currentStock: 45,
            minimumStock: 30,
            status: "adequate",
            expiryDate: "2024-12-31",
            unitType: "bags",
            storageLocation: "Warehouse A, Shelf 2",
            source: "Food Ministry Donation",
            notes: "Long-term storage food",
            lastUpdated: new Date('2024-01-15')
        },
        {
            id: generateId(),
            name: "Bottled Water (500ml)",
            category: "water",
            currentStock: 120,
            minimumStock: 200,
            status: "low",
            expiryDate: "2025-06-30",
            unitType: "bottles",
            storageLocation: "Storage Room 1",
            source: "AquaPure Company",
            notes: "Emergency drinking water",
            lastUpdated: new Date('2024-01-14')
        },
        {
            id: generateId(),
            name: "Emergency Rations",
            category: "food",
            currentStock: 8,
            minimumStock: 25,
            status: "critical",
            expiryDate: "2024-03-15",
            unitType: "packets",
            storageLocation: "Emergency Kit Storage",
            source: "Relief Organization",
            notes: "High-energy emergency food",
            lastUpdated: new Date('2024-01-16')
        },
        {
            id: generateId(),
            name: "Canned Beans",
            category: "food",
            currentStock: 65,
            minimumStock: 40,
            status: "adequate",
            expiryDate: "2024-05-20",
            unitType: "cans",
            storageLocation: "Warehouse B, Shelf 1",
            source: "Local Supermarket",
            notes: "Protein source",
            lastUpdated: new Date('2024-01-13')
        },
        {
            id: generateId(),
            name: "Energy Bars",
            category: "nutrition",
            currentStock: 15,
            minimumStock: 50,
            status: "critical",
            expiryDate: "2024-02-28",
            unitType: "bars",
            storageLocation: "Emergency Supplies",
            source: "Nutrition Corp",
            notes: "Expiring soon - prioritize distribution",
            lastUpdated: new Date('2024-01-17')
        },
        {
            id: generateId(),
            name: "Water Purification Tablets",
            category: "water",
            currentStock: 200,
            minimumStock: 100,
            status: "adequate",
            expiryDate: "2026-08-31",
            unitType: "tablets",
            storageLocation: "Medical Storage",
            source: "Health Organization",
            notes: "Water purification for emergency",
            lastUpdated: new Date('2024-01-12')
        }
    ];
    
    updateFoodUI();
}

function updateFoodUI() {
    updateFoodStats();
    filterFoodItems();
}

function updateFoodStats() {
    const total = foodInventory.length;
    const critical = foodInventory.filter(item => item.status === 'critical').length;
    const low = foodInventory.filter(item => item.status === 'low').length;
    const adequate = foodInventory.filter(item => item.status === 'adequate').length;
    const expiring = foodInventory.filter(item => isExpiringSoon(item.expiryDate)).length;

    document.getElementById('total-items').textContent = total;
    document.getElementById('critical-items').textContent = critical;
    document.getElementById('low-items').textContent = low;
    document.getElementById('adequate-items').textContent = adequate;
    document.getElementById('expiring-items').textContent = expiring;
}

// ===== FILTERING AND SEARCH =====
function filterFoodItems() {
    const searchTerm = document.getElementById('foodSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;

    filteredFoodItems = foodInventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                            item.storageLocation?.toLowerCase().includes(searchTerm);
        
        let matchesStatus = statusFilter === 'all';
        if (statusFilter === 'expiring') {
            matchesStatus = isExpiringSoon(item.expiryDate);
        } else if (statusFilter !== 'all') {
            matchesStatus = item.status === statusFilter;
        }
        
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    renderFoodTable();
}

function renderFoodTable() {
    const tbody = document.getElementById('foodTableBody');
    tbody.innerHTML = '';

    if (filteredFoodItems.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; color: #888; padding: 40px;">
                    No food items found matching your criteria
                </td>
            </tr>
        `;
        return;
    }

    filteredFoodItems.forEach(item => {
        const row = createFoodRow(item);
        tbody.appendChild(row);
    });
}

function createFoodRow(item) {
    const row = document.createElement('tr');
    
    // Determine status for row coloring
    let statusClass = item.status;
    if (isExpiringSoon(item.expiryDate)) {
        statusClass = 'expiring';
    }
    
    row.className = `food-row status-${statusClass}`;
    
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    let expiryDisplay = expiryDate.toLocaleDateString();
    let expiryWarning = '';
    
    if (daysUntilExpiry <= 30) {
        expiryDisplay = `<span class="expiry-warning">${expiryDate.toLocaleDateString()} (${daysUntilExpiry} days)</span>`;
    }

    const stockPercentage = calculateStockPercentage(item);

    row.innerHTML = `
        <td>
            <div class="item-name">${item.name}</div>
            ${item.notes ? `<div class="batch-number">${item.notes}</div>` : ''}
        </td>
        <td>
            <span class="category-badge category-${item.category}">
                ${getCategoryName(item.category)}
            </span>
        </td>
        <td>
            <div class="stock-info">
                <span class="stock-amount">${item.currentStock} ${getUnitName(item.unitType)}</span>
                <div class="stock-bar">
                    <div class="stock-level" style="width: ${stockPercentage}%; background: ${getStockColor(stockPercentage, daysUntilExpiry)}"></div>
                </div>
            </div>
        </td>
        <td>
            <span class="status-indicator status-${statusClass}">${getStatusText(statusClass)}</span>
        </td>
        <td>${expiryDisplay}</td>
        <td>
            <div>${item.storageLocation || 'Not specified'}</div>
        </td>
        <td>${item.source}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-small btn-edit" onclick="editFoodItem('${item.id}')">Edit</button>
                <button class="btn-small btn-update" onclick="updateStock('${item.id}')">Update</button>
                <button class="btn-small btn-danger" onclick="deleteFoodItem('${item.id}')">Delete</button>
            </div>
        </td>
    `;

    return row;
}

// ===== FOOD ITEM MANAGEMENT =====
function showAddFoodForm() {
    document.getElementById('addFoodForm').style.display = 'flex';
    document.getElementById('foodForm').reset();
    // Set default expiry date to 30 days from now
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 30);
    document.getElementById('expiryDate').value = defaultExpiry.toISOString().split('T')[0];
}

function closeAddFoodForm() {
    document.getElementById('addFoodForm').style.display = 'none';
}

async function addNewFoodItem(event) {
    event.preventDefault();
    
    const formData = {
        id: generateId(),
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        currentStock: parseInt(document.getElementById('currentStock').value),
        minimumStock: parseInt(document.getElementById('minimumStock').value),
        unitType: document.getElementById('unitType').value,
        expiryDate: document.getElementById('expiryDate').value,
        storageLocation: document.getElementById('storageLocation').value,
        source: document.getElementById('source').value,
        notes: document.getElementById('notes').value,
        lastUpdated: new Date(),
        status: calculateStockStatus(parseInt(document.getElementById('currentStock').value), parseInt(document.getElementById('minimumStock').value))
    };

    try {
        // Replace with actual API call
        const response = await fetch('/api/food-items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            foodInventory.unshift(formData);
            updateFoodUI();
            closeAddFoodForm();
            showNotification('Food item added successfully', 'success');
        } else {
            throw new Error('Failed to add food item');
        }
    } catch (error) {
        console.error('Error adding food item:', error);
        // Fallback to local addition
        foodInventory.unshift(formData);
        updateFoodUI();
        closeAddFoodForm();
        showNotification('Food item added successfully', 'success');
    }
}

async function updateStock(itemId) {
    const item = foodInventory.find(i => i.id === itemId);
    if (!item) return;

    const newStock = prompt(`Update stock for ${item.name} (current: ${item.currentStock} ${getUnitName(item.unitType)}):`, item.currentStock);
    if (newStock === null) return;

    const stockValue = parseInt(newStock);
    if (isNaN(stockValue) || stockValue < 0) {
        showNotification('Please enter a valid stock number', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/food-items/${itemId}/stock`, {
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
            item.currentStock = stockValue;
            item.status = calculateStockStatus(stockValue, item.minimumStock);
            item.lastUpdated = new Date();
            updateFoodUI();
            showNotification('Stock updated successfully', 'success');
        } else {
            throw new Error('Failed to update stock');
        }
    } catch (error) {
        console.error('Error updating stock:', error);
        // Fallback to local update
        item.currentStock = stockValue;
        item.status = calculateStockStatus(stockValue, item.minimumStock);
        item.lastUpdated = new Date();
        updateFoodUI();
        showNotification('Stock updated successfully', 'success');
    }
}

async function editFoodItem(itemId) {
    const item = foodInventory.find(i => i.id === itemId);
    if (!item) return;

    const newName = prompt('Edit item name:', item.name);
    if (newName) {
        item.name = newName;
        item.lastUpdated = new Date();
        updateFoodUI();
        showNotification('Item updated successfully', 'success');
    }
}

async function deleteFoodItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        const response = await fetch(`/api/food-items/${itemId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            foodInventory = foodInventory.filter(i => i.id !== itemId);
            updateFoodUI();
            showNotification('Item deleted successfully', 'success');
        } else {
            throw new Error('Failed to delete item');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        // Fallback to local deletion
        foodInventory = foodInventory.filter(i => i.id !== itemId);
        updateFoodUI();
        showNotification('Item deleted successfully', 'success');
    }
}

// ===== UTILITY FUNCTIONS =====
function calculateStockStatus(currentStock, minimumStock) {
    if (currentStock === 0) return 'critical';
    if (currentStock < minimumStock * 0.3) return 'critical';
    if (currentStock < minimumStock * 0.7) return 'low';
    return 'adequate';
}

function calculateStockPercentage(item) {
    const maxStock = Math.max(item.currentStock, item.minimumStock * 2);
    return (item.currentStock / maxStock) * 100;
}

function getStockColor(percentage, daysUntilExpiry) {
    if (daysUntilExpiry <= 7) return '#ff6b6b'; // Red for expiring in 7 days
    if (daysUntilExpiry <= 30) return '#ff9800'; // Orange for expiring in 30 days
    if (percentage < 30) return '#ff6b6b';
    if (percentage < 70) return '#ff9800';
    return '#4caf50';
}

function isExpiringSoon(expiryDate) {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const timeDiff = expiry.getTime() - today.getTime();
    const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30; // Items expiring within 30 days
}

function getCategoryName(category) {
    const categories = {
        'food': 'Food',
        'water': 'Water',
        'beverages': 'Beverages',
        'nutrition': 'Nutrition',
        'other': 'Other'
    };
    return categories[category] || category;
}

function getUnitName(unitType) {
    const units = {
        'kg': 'kg',
        'liters': 'L',
        'packets': 'packets',
        'bottles': 'bottles',
        'cans': 'cans',
        'boxes': 'boxes',
        'pieces': 'pcs',
        'bars': 'bars',
        'tablets': 'tablets',
        'bags': 'bags'
    };
    return units[unitType] || '';
}

function getStatusText(status) {
    const statusTexts = {
        'critical': 'Critical',
        'low': 'Low',
        'adequate': 'Adequate',
        'expiring': 'Expiring Soon'
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
window.showAddFoodForm = showAddFoodForm;
window.closeAddFoodForm = closeAddFoodForm;
window.addNewFoodItem = addNewFoodItem;
window.filterFoodItems = filterFoodItems;
window.updateStock = updateStock;
window.editFoodItem = editFoodItem;
window.deleteFoodItem = deleteFoodItem;
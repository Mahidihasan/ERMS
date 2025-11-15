// File: system-settings.js
// ===== System Settings & User Management =====

let currentUser = null;
let usersData = [];
let systemSettings = {};
let permissionsMatrix = {};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('System Settings Management Initialized');
    initializeSystemSettings();
});

// ===== USER MANAGEMENT =====
async function initializeSystemSettings() {
    try {
        // Get current user from session
        currentUser = await getCurrentUser();
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        // Set user role for UI
        document.getElementById('currentUserRole').textContent = 
            currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
        
        // Apply role-based styling
        document.body.className = currentUser.role;

        // Load all data
        await loadUsersData();
        await loadSystemSettings();
        await loadPermissionsMatrix();
        
        updateUI();

    } catch (error) {
        console.error('Error initializing system settings:', error);
        showNotification('Failed to load system settings', 'error');
    }
}

async function getCurrentUser() {
    // In a real application, this would verify the session
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate user data - in real app, get from session
            resolve({
                id: 'user-001',
                name: 'System Administrator',
                email: 'admin@emergencyresponse.org',
                role: 'superadmin', // superadmin, admin, director, volunteer
                lastLogin: new Date(),
                status: 'active'
            });
        }, 500);
    });
}

async function loadUsersData() {
    try {
        // Simulate API call
        usersData = await simulateUsersData();
        updateUsersTable();
        updateUserStats();
    } catch (error) {
        console.error('Error loading users data:', error);
        showNotification('Failed to load users data', 'error');
    }
}

async function simulateUsersData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 'user-001',
                    name: 'System Administrator',
                    email: 'superadmin@emergencyresponse.org',
                    role: 'superadmin',
                    status: 'active',
                    lastLogin: new Date('2024-01-18T10:30:00'),
                    phone: '+8801712345678',
                    team: 'System Administration',
                    created: new Date('2024-01-01')
                },
                {
                    id: 'user-002',
                    name: 'Operations Manager',
                    email: 'admin@emergencyresponse.org',
                    role: 'admin',
                    status: 'active',
                    lastLogin: new Date('2024-01-18T09:15:00'),
                    phone: '+8801712345679',
                    team: 'Operations',
                    created: new Date('2024-01-05')
                },
                {
                    id: 'user-003',
                    name: 'Regional Director - Sylhet',
                    email: 'director.sylhet@emergencyresponse.org',
                    role: 'director',
                    status: 'active',
                    lastLogin: new Date('2024-01-17T16:45:00'),
                    phone: '+8801712345680',
                    team: 'Sylhet Division',
                    created: new Date('2024-01-10')
                },
                {
                    id: 'user-004',
                    name: 'Abdul Rahman',
                    email: 'abdul.rahman@emergencyresponse.org',
                    role: 'volunteer',
                    status: 'active',
                    lastLogin: new Date('2024-01-18T08:20:00'),
                    phone: '+8801712345681',
                    team: 'Rescue Team A',
                    created: new Date('2024-01-12')
                },
                {
                    id: 'user-005',
                    name: 'Fatima Begum',
                    email: 'fatima.begum@emergencyresponse.org',
                    role: 'volunteer',
                    status: 'active',
                    lastLogin: new Date('2024-01-17T14:30:00'),
                    phone: '+8801712345682',
                    team: 'Medical Team',
                    created: new Date('2024-01-08')
                },
                {
                    id: 'user-006',
                    name: 'Mohammad Ali',
                    email: 'mohammad.ali@emergencyresponse.org',
                    role: 'volunteer',
                    status: 'inactive',
                    lastLogin: new Date('2024-01-10T11:15:00'),
                    phone: '+8801712345683',
                    team: 'Logistics',
                    created: new Date('2024-01-15')
                }
            ]);
        }, 1000);
    });
}

function updateUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    usersData.forEach(user => {
        const row = createUserRow(user);
        tbody.appendChild(row);
    });
}

function createUserRow(user) {
    const row = document.createElement('tr');
    const lastLogin = user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never';
    
    row.innerHTML = `
        <td>
            <div style="font-weight: 600; color: #eaeaea;">${user.name}</div>
            ${user.team ? `<div style="font-size: 12px; color: #888;">${user.team}</div>` : ''}
        </td>
        <td>${user.email}</td>
        <td>
            <span class="role-badge role-${user.role}">
                ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
        </td>
        <td>
            <span class="status-badge status-${user.status}">
                ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </span>
        </td>
        <td>${lastLogin}</td>
        <td>
            <div class="user-actions">
                <button class="btn-small btn-edit" onclick="editUser('${user.id}')">Edit</button>
                ${user.status === 'active' ? 
                    `<button class="btn-small btn-deactivate" onclick="toggleUserStatus('${user.id}')">Deactivate</button>` :
                    `<button class="btn-small btn-edit" onclick="toggleUserStatus('${user.id}')">Activate</button>`
                }
                ${user.role !== 'superadmin' || currentUser.role === 'superadmin' ? 
                    `<button class="btn-small btn-delete" onclick="deleteUser('${user.id}')">Delete</button>` :
                    ''
                }
            </div>
        </td>
    `;

    return row;
}

function updateUserStats() {
    const totalUsers = usersData.length;
    const activeUsers = usersData.filter(user => user.status === 'active').length;
    const adminCount = usersData.filter(user => user.role === 'admin' || user.role === 'superadmin').length;
    const volunteerCount = usersData.filter(user => user.role === 'volunteer').length;

    document.getElementById('total-users').textContent = totalUsers;
    document.getElementById('active-users').textContent = activeUsers;
    document.getElementById('admin-count').textContent = adminCount;
    document.getElementById('volunteer-count').textContent = volunteerCount;
}

// ===== USER MANAGEMENT ACTIONS =====
function showAddUserModal() {
    document.getElementById('addUserModal').style.display = 'flex';
    document.getElementById('addUserForm').reset();
}

function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
}

async function addNewUser(event) {
    if (event) event.preventDefault();
    
    const formData = {
        name: document.getElementById('newUserName').value,
        email: document.getElementById('newUserEmail').value,
        role: document.getElementById('newUserRole').value,
        password: document.getElementById('newUserPassword').value,
        team: document.getElementById('newUserTeam').value,
        phone: document.getElementById('newUserPhone').value
    };

    try {
        // Simulate API call
        const newUser = await simulateAddUser(formData);
        usersData.push(newUser);
        
        updateUsersTable();
        updateUserStats();
        closeAddUserModal();
        
        showNotification('User created successfully', 'success');
    } catch (error) {
        console.error('Error creating user:', error);
        showNotification('Failed to create user', 'error');
    }
}

async function simulateAddUser(userData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: 'user-' + Date.now(),
                name: userData.name,
                email: userData.email,
                role: userData.role,
                status: 'active',
                lastLogin: null,
                phone: userData.phone,
                team: userData.team,
                created: new Date()
            });
        }, 1000);
    });
}

async function editUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;

    // In a real application, this would open an edit modal
    const newName = prompt('Edit user name:', user.name);
    if (newName) {
        user.name = newName;
        updateUsersTable();
        showNotification('User updated successfully', 'success');
    }
}

async function toggleUserStatus(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;

    if (user.role === 'superadmin' && currentUser.role !== 'superadmin') {
        showNotification('Only Super Admin can modify Super Admin accounts', 'error');
        return;
    }

    user.status = user.status === 'active' ? 'inactive' : 'active';
    updateUsersTable();
    updateUserStats();
    
    showNotification(`User ${user.status === 'active' ? 'activated' : 'deactivated'} successfully`, 'success');
}

async function deleteUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;

    if (user.role === 'superadmin') {
        showNotification('Cannot delete Super Admin accounts', 'error');
        return;
    }

    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
        return;
    }

    usersData = usersData.filter(u => u.id !== userId);
    updateUsersTable();
    updateUserStats();
    
    showNotification('User deleted successfully', 'success');
}

// ===== SYSTEM CONFIGURATION =====
async function loadSystemSettings() {
    try {
        systemSettings = await simulateSystemSettings();
        populateSystemSettingsForm();
    } catch (error) {
        console.error('Error loading system settings:', error);
    }
}

async function simulateSystemSettings() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                systemName: 'Emergency Response System',
                timezone: 'Asia/Dhaka',
                defaultLanguage: 'en',
                dateFormat: 'DD/MM/YYYY',
                responseTimeTarget: 30,
                autoAssign: true,
                alertThreshold: 'medium',
                reorderPoint: 20,
                passwordPolicy: 'medium',
                sessionTimeout: 60,
                maxLoginAttempts: 5,
                lockoutDuration: 30,
                twoFactorRequirement: 'admins',
                twoFactorMethod: 'app',
                enhancedSecurity: false
            });
        }, 500);
    });
}

function populateSystemSettingsForm() {
    // System Configuration
    document.getElementById('system-name').value = systemSettings.systemName;
    document.getElementById('timezone').value = systemSettings.timezone;
    document.getElementById('default-language').value = systemSettings.defaultLanguage;
    document.getElementById('date-format').value = systemSettings.dateFormat;
    document.getElementById('response-time-target').value = systemSettings.responseTimeTarget;
    document.getElementById('auto-assign').checked = systemSettings.autoAssign;
    document.getElementById('alert-threshold').value = systemSettings.alertThreshold;
    document.getElementById('reorder-point').value = systemSettings.reorderPoint;

    // Security Settings
    document.getElementById('password-policy').value = systemSettings.passwordPolicy;
    document.getElementById('session-timeout').value = systemSettings.sessionTimeout;
    document.getElementById('max-login-attempts').value = systemSettings.maxLoginAttempts;
    document.getElementById('lockout-duration').value = systemSettings.lockoutDuration;
    document.getElementById('2fa-requirement').value = systemSettings.twoFactorRequirement;
    document.getElementById('2fa-method').value = systemSettings.twoFactorMethod;
    document.getElementById('enhanced-security').checked = systemSettings.enhancedSecurity;
}

function saveSystemConfig() {
    // Collect form data
    const config = {
        systemName: document.getElementById('system-name').value,
        timezone: document.getElementById('timezone').value,
        defaultLanguage: document.getElementById('default-language').value,
        dateFormat: document.getElementById('date-format').value,
        responseTimeTarget: parseInt(document.getElementById('response-time-target').value),
        autoAssign: document.getElementById('auto-assign').checked,
        alertThreshold: document.getElementById('alert-threshold').value,
        reorderPoint: parseInt(document.getElementById('reorder-point').value)
    };

    // Simulate save
    systemSettings = { ...systemSettings, ...config };
    showNotification('System configuration saved successfully', 'success');
}

function resetSystemConfig() {
    if (confirm('Are you sure you want to reset system configuration to default values?')) {
        populateSystemSettingsForm();
        showNotification('System configuration reset to defaults', 'info');
    }
}

function saveSecuritySettings() {
    const securityConfig = {
        passwordPolicy: document.getElementById('password-policy').value,
        sessionTimeout: parseInt(document.getElementById('session-timeout').value),
        maxLoginAttempts: parseInt(document.getElementById('max-login-attempts').value),
        lockoutDuration: parseInt(document.getElementById('lockout-duration').value),
        twoFactorRequirement: document.getElementById('2fa-requirement').value,
        twoFactorMethod: document.getElementById('2fa-method').value,
        enhancedSecurity: document.getElementById('enhanced-security').checked
    };

    systemSettings = { ...systemSettings, ...securityConfig };
    showNotification('Security settings saved successfully', 'success');
}

function resetSecuritySettings() {
    if (confirm('Are you sure you want to reset security settings to default values?')) {
        populateSystemSettingsForm();
        showNotification('Security settings reset to defaults', 'info');
    }
}

// ===== PERMISSION MANAGEMENT =====
async function loadPermissionsMatrix() {
    try {
        permissionsMatrix = await simulatePermissionsMatrix();
        updatePermissionsTable();
    } catch (error) {
        console.error('Error loading permissions matrix:', error);
    }
}

async function simulatePermissionsMatrix() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                features: [
                    { name: 'User Management', superadmin: true, admin: true, director: false, volunteer: false },
                    { name: 'System Configuration', superadmin: true, admin: true, director: false, volunteer: false },
                    { name: 'Security Settings', superadmin: true, admin: false, director: false, volunteer: false },
                    { name: 'Permission Management', superadmin: true, admin: true, director: false, volunteer: false },
                    { name: 'View Reports', superadmin: true, admin: true, director: true, volunteer: false },
                    { name: 'Generate Reports', superadmin: true, admin: true, director: false, volunteer: false },
                    { name: 'Manage Inventory', superadmin: true, admin: true, director: true, volunteer: false },
                    { name: 'View Inventory', superadmin: true, admin: true, director: true, volunteer: true },
                    { name: 'Emergency Response', superadmin: true, admin: true, director: true, volunteer: true },
                    { name: 'Assign Volunteers', superadmin: true, admin: true, director: true, volunteer: false },
                    { name: 'Donation Management', superadmin: true, admin: true, director: true, volunteer: false },
                    { name: 'Audit Log Access', superadmin: true, admin: false, director: false, volunteer: false }
                ]
            });
        }, 500);
    });
}

function updatePermissionsTable() {
    const tbody = document.getElementById('permissionsTableBody');
    tbody.innerHTML = '';

    permissionsMatrix.features.forEach(feature => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="feature-cell">${feature.name}</td>
            <td>${feature.superadmin ? '<span class="permission-check">✓</span>' : '<span class="permission-deny">✗</span>'}</td>
            <td>${feature.admin ? '<span class="permission-check">✓</span>' : '<span class="permission-deny">✗</span>'}</td>
            <td>${feature.director ? '<span class="permission-check">✓</span>' : '<span class="permission-deny">✗</span>'}</td>
            <td>${feature.volunteer ? '<span class="permission-check">✓</span>' : '<span class="permission-deny">✗</span>'}</td>
        `;

        tbody.appendChild(row);
    });
}

function createCustomRole() {
    const roleName = document.getElementById('new-role-name').value;
    const template = document.getElementById('role-template').value;

    if (!roleName) {
        showNotification('Please enter a role name', 'error');
        return;
    }

    showNotification(`Custom role "${roleName}" created based on ${template} template`, 'success');
    document.getElementById('new-role-name').value = '';
}

function savePermissionSettings() {
    showNotification('Permission settings saved successfully', 'success');
}

// ===== USER SETTINGS =====
function saveUserSettings() {
    const userLimits = {
        superadminLimit: parseInt(document.getElementById('superadmin-limit').value),
        adminLimit: parseInt(document.getElementById('admin-limit').value),
        directorLimit: parseInt(document.getElementById('director-limit').value),
        volunteerExpiry: parseInt(document.getElementById('volunteer-expiry').value)
    };

    // Validate limits
    const currentSuperadmins = usersData.filter(u => u.role === 'superadmin').length;
    if (currentSuperadmins > userLimits.superadminLimit) {
        showNotification(`Cannot reduce Super Admin limit below current count (${currentSuperadmins})`, 'error');
        return;
    }

    showNotification('User settings saved successfully', 'success');
}

function resetUserSettings() {
    if (confirm('Are you sure you want to reset user settings to default values?')) {
        document.getElementById('superadmin-limit').value = 3;
        document.getElementById('admin-limit').value = 10;
        document.getElementById('director-limit').value = 5;
        document.getElementById('volunteer-expiry').value = 90;
        showNotification('User settings reset to defaults', 'info');
    }
}

// ===== UTILITY FUNCTIONS =====
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

function updateUI() {
    updateUsersTable();
    updateUserStats();
    updatePermissionsTable();
}

// ===== EXPORT FUNCTIONS =====
window.showAddUserModal = showAddUserModal;
window.closeAddUserModal = closeAddUserModal;
window.addNewUser = addNewUser;
window.editUser = editUser;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser;
window.saveSystemConfig = saveSystemConfig;
window.resetSystemConfig = resetSystemConfig;
window.saveSecuritySettings = saveSecuritySettings;
window.resetSecuritySettings = resetSecuritySettings;
window.createCustomRole = createCustomRole;
window.savePermissionSettings = savePermissionSettings;
window.saveUserSettings = saveUserSettings;
window.resetUserSettings = resetUserSettings;
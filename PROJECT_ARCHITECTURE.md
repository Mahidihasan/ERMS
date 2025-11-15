# EMERGENCY RESCUE MANAGEMENT SYSTEM
## Complete Project Architecture & File Structure

---

## TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [Complete Directory Structure](#complete-directory-structure)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Architecture](#database-architecture)
6. [Configuration Files](#configuration-files)
7. [Files to Create](#files-to-create)
8. [Detailed File Specifications](#detailed-file-specifications)

---

## PROJECT OVERVIEW

**Technology Stack:**
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** Firebase Firestore (NoSQL)
- **Real-time:** Socket.IO
- **Authentication:** Firebase Auth
- **Storage:** Firebase Storage
- **Deployment:** Firebase Hosting / Heroku

---

## COMPLETE DIRECTORY STRUCTURE

```
ProjectRescue/
│
├── .gitignore                          # Git ignore file
├── .env.example                        # Environment variables template
├── README.md                           # Project documentation
├── PROJECT_PROPOSAL.md                 # Academic proposal
├── PROJECT_ARCHITECTURE.md             # This file
├── package.json                        # Root package.json (optional workspace)
│
├── app/                                # FRONTEND APPLICATION
│   ├── index.html                      # Landing page
│   ├── login.html                      # ✓ EXISTS - Login page
│   ├── user_page.html                  # ✓ EXISTS - User emergency submission
│   ├── admin.html                      # ✓ EXISTS - Admin dashboard
│   ├── volunteer-portal.html           # Volunteer dashboard
│   │
│   ├── css/                            # Stylesheets (organized)
│   │   ├── main.css                    # Global styles
│   │   ├── login.css                   # Login page styles (extract from login.html)
│   │   ├── admin.css                   # ✓ EXISTS - Admin styles
│   │   ├── user.css                    # User page styles
│   │   └── volunteer.css               # Volunteer portal styles
│   │
│   ├── js/                             # JavaScript files (organized)
│   │   ├── config.js                   # Firebase config (frontend)
│   │   ├── auth.js                     # Authentication logic
│   │   ├── socket-client.js            # Socket.IO client setup
│   │   ├── utils.js                    # Utility functions
│   │   ├── api.js                      # API call wrappers
│   │   ├── admin.js                    # ✓ EXISTS - Admin dashboard logic
│   │   ├── user.js                     # User page logic
│   │   ├── volunteer.js                # Volunteer portal logic
│   │   ├── map.js                      # Map/geolocation utilities
│   │   ├── notification.js             # Frontend notifications
│   │   └── validation.js               # Form validation
│   │
│   ├── admin/                          # Admin sub-pages
│   │   ├── analytics-dashboard.html    # ✓ EXISTS - Analytics page
│   │   ├── donation.html               # ✓ EXISTS - Donation management
│   │   ├── pending-requests.html       # ✓ EXISTS - Pending requests
│   │   ├── volunteer-management.html   # ✓ EXISTS - Volunteer management
│   │   ├── system-admin.html           # ✓ EXISTS - System administration
│   │   ├── system-settings.html        # ✓ EXISTS - System settings
│   │   ├── report-generation.html      # ✓ EXISTS - Report generation
│   │   └── user-management.html        # NEW - User account management
│   │
│   ├── inventory/                      # Inventory management pages
│   │   ├── medicine-inventory.html     # ✓ EXISTS - Medicine inventory
│   │   ├── food-inventory.html         # ✓ EXISTS - Food inventory
│   │   ├── vehicles-inventory.html     # ✓ EXISTS - Vehicles inventory
│   │   ├── shelter-inventory.html      # ✓ EXISTS - Shelter inventory
│   │   ├── equipment-inventory.html    # ✓ EXISTS - Equipment inventory
│   │   ├── medicine-inventory.js       # ✓ EXISTS - Medicine JS
│   │   ├── food-inventory.js           # ✓ EXISTS - Food JS
│   │   ├── vehicles-inventory.js       # ✓ EXISTS - Vehicles JS
│   │   ├── shelter-inventory.js        # ✓ EXISTS - Shelter JS
│   │   ├── equipment-inventory.js      # ✓ EXISTS - Equipment JS
│   │   └── food-packages.js            # ✓ EXISTS - Food packages JS
│   │
│   ├── assets/                         # Static assets
│   │   ├── images/
│   │   │   ├── loginpage.png           # ✓ EXISTS - Login background
│   │   │   ├── logo.png                # NEW - System logo
│   │   │   └── favicon.ico             # NEW - Favicon
│   │   ├── icons/                      # NEW - Custom icons
│   │   └── fonts/                      # NEW - Custom fonts (if any)
│   │
│   └── docs/                           # User documentation
│       ├── user-manual.pdf             # NEW - User guide
│       └── admin-manual.pdf            # NEW - Admin guide
│
├── emergency-backend/                  # BACKEND APPLICATION
│   ├── package.json                    # ✓ EXISTS - Backend dependencies
│   ├── package-lock.json               # Auto-generated
│   ├── .env                            # Environment variables (DO NOT COMMIT)
│   ├── .env.example                    # Environment template
│   ├── server.js                       # ✓ EXISTS - Main server file
│   ├── app.js                          # NEW - Express app configuration
│   │
│   ├── config/                         # Configuration files
│   │   ├── firebaseConfig.js           # ✓ EXISTS - Firebase initialization
│   │   ├── serviceAccountKey.json      # ✓ EXISTS - Firebase credentials (DO NOT COMMIT)
│   │   ├── database.js                 # NEW - Database connection config
│   │   ├── cors.js                     # NEW - CORS configuration
│   │   └── multer.js                   # NEW - File upload configuration
│   │
│   ├── routes/                         # API Routes
│   │   ├── index.js                    # NEW - Main router
│   │   ├── userRoutes.js               # ✓ EXISTS - User endpoints
│   │   ├── adminRoutes.js              # ✓ EXISTS - Admin endpoints
│   │   ├── volunteerRoutes.js          # ✓ EXISTS - Volunteer endpoints
│   │   ├── authRoutes.js               # NEW - Authentication endpoints
│   │   ├── inventoryRoutes.js          # NEW - Inventory endpoints
│   │   ├── analyticsRoutes.js          # NEW - Analytics endpoints
│   │   ├── reportRoutes.js             # NEW - Report generation endpoints
│   │   └── uploadRoutes.js             # NEW - File upload endpoints
│   │
│   ├── controllers/                    # Business Logic Controllers
│   │   ├── userController.js           # ✓ EXISTS - User operations
│   │   ├── adminController.js          # ✓ EXISTS - Admin operations
│   │   ├── volunteerController.js      # ✓ EXISTS - Volunteer operations
│   │   ├── authController.js           # NEW - Authentication logic
│   │   ├── inventoryController.js      # NEW - Inventory management
│   │   ├── analyticsController.js      # NEW - Analytics data
│   │   ├── reportController.js         # NEW - Report generation
│   │   └── uploadController.js         # NEW - File uploads
│   │
│   ├── models/                         # Data Models
│   │   ├── requestModel.js             # ✓ EXISTS - Help request schema
│   │   ├── userModel.js                # ✓ EXISTS - User schema
│   │   ├── volunteerModel.js           # ✓ EXISTS - Volunteer schema
│   │   ├── inventoryModel.js           # NEW - Inventory item schema
│   │   ├── notificationModel.js        # NEW - Notification schema
│   │   └── reportModel.js              # NEW - Report schema
│   │
│   ├── services/                       # Service Layer (Business Logic)
│   │   ├── firebaseService.js          # ✓ EXISTS - Firebase operations
│   │   ├── authService.js              # NEW - Authentication services
│   │   ├── emailService.js             # NEW - Email notifications
│   │   ├── smsService.js               # NEW - SMS notifications
│   │   ├── storageService.js           # NEW - File storage operations
│   │   ├── geolocationService.js       # NEW - Location-based services
│   │   └── analyticsService.js         # NEW - Data analytics
│   │
│   ├── middleware/                     # Middleware Functions
│   │   ├── authMiddleware.js           # ✓ EXISTS - Authentication
│   │   ├── errorHandler.js             # NEW - Global error handling
│   │   ├── validator.js                # NEW - Request validation
│   │   ├── rateLimit.js                # NEW - Rate limiting
│   │   ├── uploadMiddleware.js         # NEW - File upload handling
│   │   └── logger.js                   # NEW - Request logging
│   │
│   ├── utils/                          # Utility Functions
│   │   ├── authMiddleware.js           # ✓ EXISTS - Auth utilities
│   │   ├── validation.js               # ✓ EXISTS - Validation helpers
│   │   ├── notification.js             # ✓ EXISTS - Notification helpers
│   │   ├── constants.js                # NEW - App constants
│   │   ├── helpers.js                  # NEW - General helpers
│   │   ├── errorCodes.js               # NEW - Error code definitions
│   │   └── responseFormatter.js        # NEW - API response formatter
│   │
│   ├── sockets/                        # WebSocket Implementation
│   │   ├── socket.js                   # ✓ EXISTS - Socket.IO setup
│   │   ├── handlers/                   # NEW - Socket event handlers
│   │   │   ├── requestHandler.js       # NEW - Request events
│   │   │   ├── volunteerHandler.js     # NEW - Volunteer events
│   │   │   └── chatHandler.js          # NEW - Chat events
│   │   └── middleware/                 # NEW - Socket middleware
│   │       └── socketAuth.js           # NEW - Socket authentication
│   │
│   ├── jobs/                           # Background Jobs (optional)
│   │   ├── scheduler.js                # NEW - Job scheduler
│   │   ├── reportGeneration.js         # NEW - Scheduled reports
│   │   └── dataCleanup.js              # NEW - Data cleanup tasks
│   │
│   ├── tests/                          # Test Files
│   │   ├── unit/                       # Unit tests
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── integration/                # Integration tests
│   │   │   ├── api/
│   │   │   └── database/
│   │   ├── setup.js                    # Test setup
│   │   └── teardown.js                 # Test cleanup
│   │
│   ├── logs/                           # Log Files (DO NOT COMMIT)
│   │   ├── error.log
│   │   ├── combined.log
│   │   └── access.log
│   │
│   └── uploads/                        # Uploaded Files (DO NOT COMMIT)
│       ├── attachments/
│       ├── profile-pictures/
│       └── temp/
│
├── database/                           # Database Scripts & Schemas
│   ├── firestore/
│   │   ├── security-rules.json         # NEW - Firestore security rules
│   │   ├── indexes.json                # NEW - Firestore indexes
│   │   └── seed-data.json              # NEW - Sample data for testing
│   ├── schemas/
│   │   ├── collections.md              # NEW - Collection documentation
│   │   └── erd-diagram.png             # NEW - Entity relationship diagram
│   └── migrations/                     # NEW - Database migrations (if needed)
│
├── docs/                               # Project Documentation
│   ├── api/
│   │   ├── swagger.yaml                # NEW - API documentation (Swagger)
│   │   └── postman-collection.json     # NEW - Postman API collection
│   ├── architecture/
│   │   ├── system-design.md            # NEW - System design doc
│   │   ├── database-design.md          # NEW - Database design
│   │   └── diagrams/                   # NEW - Architecture diagrams
│   ├── deployment/
│   │   ├── deployment-guide.md         # NEW - Deployment instructions
│   │   ├── server-setup.md             # NEW - Server configuration
│   │   └── ci-cd-pipeline.md           # NEW - CI/CD documentation
│   └── development/
│       ├── coding-standards.md         # NEW - Code style guide
│       ├── git-workflow.md             # NEW - Git branching strategy
│       └── testing-guide.md            # NEW - Testing guidelines
│
├── scripts/                            # Utility Scripts
│   ├── setup.sh                        # NEW - Project setup script
│   ├── deploy.sh                       # NEW - Deployment script
│   ├── backup.sh                       # NEW - Database backup
│   ├── seed-database.js                # NEW - Seed sample data
│   └── generate-docs.js                # NEW - Auto-generate API docs
│
├── .github/                            # GitHub-specific files
│   ├── workflows/                      # GitHub Actions CI/CD
│   │   ├── ci.yml                      # NEW - Continuous Integration
│   │   └── deploy.yml                  # NEW - Deployment workflow
│   └── ISSUE_TEMPLATE/                 # Issue templates
│       ├── bug_report.md               # NEW - Bug report template
│       └── feature_request.md          # NEW - Feature request template
│
└── firebase.json                       # NEW - Firebase configuration
```

---

## FRONTEND ARCHITECTURE

### **HTML Pages Structure**

#### **1. index.html** (NEW - Landing Page)
```html
Purpose: Public landing page with project overview
Components:
- Hero section with call-to-action
- Feature highlights
- Quick access to login/emergency alert
- Footer with contact info
```

#### **2. login.html** ✓ EXISTS
```html
Current State: Functional with localStorage auth
Required Updates:
- Integrate Firebase Authentication
- Replace hardcoded users with Firebase Auth API
- Add JWT token handling
- Implement "Forgot Password" flow
```

#### **3. user_page.html** ✓ EXISTS
```html
Current State: Emergency submission form
Required Updates:
- Fix API endpoint (/api/users/helpRequest instead of /api/emergency-alerts)
- Implement file upload to Firebase Storage
- Add Socket.IO client for real-time feedback
- Add form validation
- Add success/error notifications
```

#### **4. admin.html** ✓ EXISTS
```html
Current State: Dashboard with placeholders
Required Updates:
- Connect to backend APIs for live data
- Implement Socket.IO for real-time updates
- Add Bangladesh heat map with real data
- Connect inventory links to inventory pages
- Add live chat functionality
```

#### **5. volunteer-portal.html** (NEW - Critical)
```html
Purpose: Volunteer task management
Components:
- Task list with priority badges
- Map view of assigned locations
- Accept/Decline buttons
- Task status updates
- Performance dashboard
- Live notifications
```

### **CSS Organization**

#### **main.css** (NEW)
```css
/* Global Styles */
- CSS Variables (colors, fonts, spacing)
- Reset/Normalize
- Typography
- Common components (buttons, cards, forms)
- Responsive utilities
- Animation keyframes
```

#### **Component-Specific Styles**
- Extract inline styles from HTML files
- Create modular CSS for reusability
- Use BEM naming convention

### **JavaScript Organization**

#### **config.js** (NEW - Critical)
```javascript
// Firebase Configuration
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "YOUR_APP_ID"
};

export const API_BASE_URL = 'http://localhost:5000/api';
export const SOCKET_URL = 'http://localhost:5000';
```

#### **auth.js** (NEW - Critical)
```javascript
// Authentication Functions
- login(email, password)
- logout()
- register(userData)
- resetPassword(email)
- getCurrentUser()
- onAuthStateChanged(callback)
- getIdToken()
```

#### **socket-client.js** (NEW - Critical)
```javascript
// Socket.IO Client
- initializeSocket()
- joinRoom(userId, role)
- onNewRequest(callback)
- onTaskAssigned(callback)
- onStatusUpdate(callback)
- emit(event, data)
```

#### **api.js** (NEW - Critical)
```javascript
// API Wrapper Functions
- makeRequest(method, endpoint, data)
- getAuthHeaders()
- handleResponse(response)
- handleError(error)

// Specific API calls:
- submitEmergencyRequest(data)
- getMyRequests()
- getAllRequests()
- assignVolunteer(requestId, volunteerId)
- updateTaskStatus(taskId, status)
- getInventory(category)
- updateInventory(category, itemId, data)
```

#### **utils.js** (NEW)
```javascript
// Utility Functions
- formatDate(timestamp)
- formatPhoneNumber(number)
- getPriorityColor(priority)
- showNotification(message, type)
- validateEmail(email)
- validatePhone(phone)
- truncateText(text, length)
```

#### **validation.js** (NEW)
```javascript
// Form Validation
- validateEmergencyForm(formData)
- validateLoginForm(formData)
- validateInventoryForm(formData)
- showValidationError(field, message)
- clearValidationErrors()
```

#### **map.js** (NEW)
```javascript
// Map & Geolocation
- initMap(elementId, center)
- addMarker(lat, lng, data)
- createHeatmap(locations)
- getCurrentLocation()
- reverseGeocode(lat, lng)
- calculateDistance(point1, point2)
```

---

## BACKEND ARCHITECTURE

### **Core Files**

#### **server.js** ✓ EXISTS
```javascript
Current State: Basic Express + Socket.IO setup
Required Updates:
- Import app.js for better separation
- Add graceful shutdown handling
- Add cluster mode for production
- Improve error handling
```

#### **app.js** (NEW - Critical)
```javascript
// Express App Configuration
- Middleware setup (CORS, body-parser, helmet)
- Route mounting
- Error handling middleware
- 404 handler
- Export app for testing

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

module.exports = app;
```

### **Routes Architecture**

#### **routes/index.js** (NEW - Critical)
```javascript
// Main Router - Mounts all sub-routes
const router = require('express').Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const volunteerRoutes = require('./volunteerRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const reportRoutes = require('./reportRoutes');
const uploadRoutes = require('./uploadRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', reportRoutes);
router.use('/uploads', uploadRoutes);

module.exports = router;
```

#### **authRoutes.js** (NEW - Critical)
```javascript
// Authentication Endpoints
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/logout            - Logout user
POST   /api/auth/refresh-token     - Refresh JWT token
POST   /api/auth/forgot-password   - Send password reset email
POST   /api/auth/reset-password    - Reset password with token
GET    /api/auth/me                - Get current user info
```

#### **inventoryRoutes.js** (NEW - Critical)
```javascript
// Inventory Management Endpoints
GET    /api/inventory/medicine     - Get all medicine items
POST   /api/inventory/medicine     - Add medicine item
PUT    /api/inventory/medicine/:id - Update medicine item
DELETE /api/inventory/medicine/:id - Delete medicine item

// Repeat for: food, vehicles, shelter, equipment
GET    /api/inventory/:category
POST   /api/inventory/:category
PUT    /api/inventory/:category/:id
DELETE /api/inventory/:category/:id
```

#### **analyticsRoutes.js** (NEW)
```javascript
// Analytics Endpoints
GET    /api/analytics/dashboard    - Get dashboard statistics
GET    /api/analytics/heatmap      - Get heat map data
GET    /api/analytics/trends       - Get trend data
GET    /api/analytics/performance  - Get performance metrics
```

#### **reportRoutes.js** (NEW)
```javascript
// Report Generation Endpoints
POST   /api/reports/generate       - Generate custom report
GET    /api/reports/:id            - Get report by ID
GET    /api/reports/download/:id   - Download report PDF
GET    /api/reports/list           - List all reports
```

#### **uploadRoutes.js** (NEW - Critical)
```javascript
// File Upload Endpoints
POST   /api/uploads/attachment     - Upload emergency attachment
POST   /api/uploads/profile        - Upload profile picture
DELETE /api/uploads/:id            - Delete uploaded file
```

### **Controllers**

#### **authController.js** (NEW - Critical)
```javascript
// Authentication Controller Functions
exports.register = async (req, res) => {
  // 1. Validate input
  // 2. Check if user exists
  // 3. Create Firebase Auth user
  // 4. Create Firestore user document
  // 5. Generate JWT token
  // 6. Return user data + token
};

exports.login = async (req, res) => {
  // 1. Validate credentials
  // 2. Verify Firebase Auth
  // 3. Generate JWT token
  // 4. Return user data + token
};

exports.logout = async (req, res) => {};
exports.refreshToken = async (req, res) => {};
exports.forgotPassword = async (req, res) => {};
exports.resetPassword = async (req, res) => {};
exports.getCurrentUser = async (req, res) => {};
```

#### **inventoryController.js** (NEW - Critical)
```javascript
// Inventory Management Functions
exports.getAllItems = async (req, res) => {
  const { category } = req.params;
  // Fetch from Firestore collection: ${category}Inventory
};

exports.createItem = async (req, res) => {
  // Validate data
  // Add to Firestore
  // Emit Socket.IO update
};

exports.updateItem = async (req, res) => {};
exports.deleteItem = async (req, res) => {};
exports.getLowStock = async (req, res) => {};
```

#### **analyticsController.js** (NEW)
```javascript
// Analytics Functions
exports.getDashboardStats = async (req, res) => {
  // Aggregate data:
  // - Active requests count
  // - Completed rescues count
  // - Unsolved cases count
  // - Fatalities count
  // - Available volunteers
};

exports.getHeatmapData = async (req, res) => {
  // Fetch all requests with coordinates
  // Group by geographic zones
  // Calculate density/intensity
};

exports.getTrendData = async (req, res) => {};
exports.getPerformanceMetrics = async (req, res) => {};
```

#### **uploadController.js** (NEW - Critical)
```javascript
// File Upload Handler
const multer = require('multer');
const { uploadToFirebase } = require('../services/storageService');

exports.uploadAttachment = async (req, res) => {
  // 1. Validate file type/size
  // 2. Upload to Firebase Storage
  // 3. Get download URL
  // 4. Save metadata to Firestore
  // 5. Return file URL
};
```

### **Services**

#### **authService.js** (NEW)
```javascript
// Authentication Business Logic
exports.createUser = async (userData) => {};
exports.verifyUser = async (email, password) => {};
exports.generateToken = (userId, role) => {};
exports.verifyToken = (token) => {};
exports.sendPasswordResetEmail = async (email) => {};
```

#### **emailService.js** (NEW)
```javascript
// Email Notification Service (using Nodemailer or SendGrid)
const nodemailer = require('nodemailer');

exports.sendEmail = async (to, subject, html) => {
  // Configure transporter
  // Send email
};

exports.sendWelcomeEmail = async (userEmail, userName) => {};
exports.sendEmergencyAlert = async (adminEmail, requestData) => {};
exports.sendPasswordReset = async (email, resetToken) => {};
```

#### **smsService.js** (NEW)
```javascript
// SMS Notification Service (using Twilio)
const twilio = require('twilio');

exports.sendSMS = async (phoneNumber, message) => {
  // Configure Twilio client
  // Send SMS
};

exports.sendEmergencyAlertSMS = async (phone, requestId) => {};
```

#### **storageService.js** (NEW - Critical)
```javascript
// Firebase Storage Operations
const { admin } = require('../config/firebaseConfig');
const bucket = admin.storage().bucket();

exports.uploadFile = async (file, path) => {
  // Upload file to Firebase Storage
  // Return download URL
};

exports.deleteFile = async (filePath) => {};
exports.getFileURL = async (filePath) => {};
```

#### **geolocationService.js** (NEW)
```javascript
// Geolocation Utilities
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Haversine formula
};

exports.findNearestVolunteers = async (lat, lng, radius) => {
  // Query volunteers within radius
};

exports.reverseGeocode = async (lat, lng) => {
  // Convert coordinates to address (using Google Maps API)
};
```

### **Middleware**

#### **errorHandler.js** (NEW - Critical)
```javascript
// Global Error Handler
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

#### **validator.js** (NEW)
```javascript
// Request Validation Middleware
const { validationResult } = require('express-validator');

exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    res.status(400).json({ errors: errors.array() });
  };
};
```

#### **rateLimit.js** (NEW)
```javascript
// Rate Limiting
const rateLimit = require('express-rate-limit');

exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts
  message: 'Too many login attempts'
});
```

#### **uploadMiddleware.js** (NEW - Critical)
```javascript
// File Upload Middleware (Multer)
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Invalid file type');
  }
};

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});
```

#### **logger.js** (NEW)
```javascript
// Request Logging (Winston)
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

exports.logger = logger;

// Express middleware
exports.requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};
```

### **Socket.IO Structure**

#### **handlers/requestHandler.js** (NEW)
```javascript
// Socket Event Handlers for Requests
module.exports = (io, socket) => {
  socket.on('newRequest', async (data) => {
    // Broadcast to admins
    io.to('admins').emit('requestCreated', data);
  });
  
  socket.on('requestUpdated', async (data) => {
    io.to('admins').emit('requestStatusChanged', data);
  });
};
```

#### **handlers/volunteerHandler.js** (NEW)
```javascript
// Socket Event Handlers for Volunteers
module.exports = (io, socket) => {
  socket.on('acceptTask', async (taskId) => {
    // Update database
    // Notify admin
    io.to('admins').emit('taskAccepted', { taskId, volunteerId: socket.userId });
  });
  
  socket.on('updateLocation', async (location) => {
    // Update volunteer location in Firestore
  });
};
```

#### **handlers/chatHandler.js** (NEW)
```javascript
// Socket Event Handlers for Chat
module.exports = (io, socket) => {
  socket.on('sendMessage', async (messageData) => {
    // Save message to Firestore
    // Broadcast to room
    io.to(messageData.room).emit('newMessage', messageData);
  });
};
```

---

## DATABASE ARCHITECTURE

### **Firebase Firestore Collections**

#### **users**
```javascript
{
  uid: string (Firebase Auth UID),
  username: string,
  email: string,
  fullName: string,
  role: enum ['user', 'volunteer', 'admin', 'super_admin', 'director'],
  phoneNumber: string,
  profilePicture: string (URL),
  status: enum ['active', 'inactive', 'suspended'],
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLogin: timestamp
}

// Indexes:
- role (for querying by role)
- email (for lookups)
- status (for filtering active users)
```

#### **helpRequests**
```javascript
{
  id: auto-generated,
  userId: string (reference to users),
  fullName: string,
  phoneNumber: string,
  emergencyType: enum ['medical', 'fire', 'accident', 'natural-disaster', 'crime', 'other'],
  priorityLevel: enum ['low', 'medium', 'high', 'critical'],
  peopleCount: number,
  address: string,
  latitude: number,
  longitude: number,
  geopoint: geopoint (for geoqueries),
  additionalDetails: string,
  attachments: array of strings (URLs),
  status: enum ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
  assignedVolunteer: string (reference to volunteers),
  assignedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp,
  completedAt: timestamp,
  responseTime: number (minutes),
  notes: string (admin notes)
}

// Indexes:
- status (for filtering)
- priorityLevel, status (composite for sorted queries)
- assignedVolunteer (for volunteer queries)
- createdAt (for time-based queries)
- geopoint (for geolocation queries)
```

#### **volunteers**
```javascript
{
  volunteerId: string,
  userId: string (reference to users),
  team: string,
  specialization: array of strings,
  availabilityStatus: enum ['available', 'busy', 'offline'],
  currentLocation: {
    latitude: number,
    longitude: number,
    geopoint: geopoint,
    lastUpdated: timestamp
  },
  assignedTasks: array of references,
  completedTasks: number,
  activeTasksCount: number,
  rating: number (1-5),
  totalRatings: number,
  joinedAt: timestamp,
  lastActive: timestamp,
  certifications: array of strings,
  emergencyContact: string
}

// Indexes:
- availabilityStatus
- currentLocation.geopoint (for geoqueries)
- team
```

#### **medicineInventory**
```javascript
{
  id: auto-generated,
  itemName: string,
  category: string,
  genericName: string,
  brand: string,
  quantity: number,
  unit: string (tablets, bottles, boxes),
  minimumStock: number,
  expiryDate: timestamp,
  batchNumber: string,
  supplier: string,
  location: string (storage location),
  status: enum ['in-stock', 'low-stock', 'out-of-stock', 'expired'],
  lastRestocked: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}

// Similar structure for:
// - foodInventory
// - vehiclesInventory
// - shelterInventory
// - equipmentInventory
```

#### **notifications**
```javascript
{
  id: auto-generated,
  userId: string,
  type: enum ['task_assigned', 'request_update', 'system_alert', 'chat_message'],
  title: string,
  message: string,
  data: object (additional data),
  read: boolean,
  priority: enum ['low', 'medium', 'high'],
  createdAt: timestamp,
  readAt: timestamp
}

// Indexes:
- userId, read (composite)
- createdAt
```

#### **reports**
```javascript
{
  id: auto-generated,
  title: string,
  type: enum ['daily', 'weekly', 'monthly', 'custom'],
  generatedBy: string (userId),
  dateRange: {
    start: timestamp,
    end: timestamp
  },
  data: object (report data),
  fileUrl: string (PDF URL),
  status: enum ['generating', 'completed', 'failed'],
  createdAt: timestamp
}
```

#### **chatMessages**
```javascript
{
  id: auto-generated,
  room: string (requestId or team),
  senderId: string,
  senderName: string,
  message: string,
  attachments: array,
  timestamp: timestamp,
  read: boolean
}
```

### **Firestore Security Rules**

#### **security-rules.json** (NEW - Critical)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
    
    function isVolunteer() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'volunteer';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                      (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Help Requests
    match /helpRequests/{requestId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAdmin() || isVolunteer();
      allow delete: if isAdmin();
    }
    
    // Volunteers
    match /volunteers/{volunteerId} {
      allow read: if isAuthenticated();
      allow update: if isAdmin() || 
                      (isVolunteer() && request.auth.uid == resource.data.userId);
    }
    
    // Inventory collections
    match /{inventoryType}Inventory/{itemId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Notifications
    match /notifications/{notifId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAdmin();
      allow update: if resource.data.userId == request.auth.uid;
    }
  }
}
```

### **Firestore Indexes**

#### **indexes.json** (NEW)
```json
{
  "indexes": [
    {
      "collectionGroup": "helpRequests",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "priorityLevel", "order": "DESCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "helpRequests",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "assignedVolunteer", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "volunteers",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "availabilityStatus", "order": "ASCENDING" },
        { "fieldPath": "currentLocation.geopoint", "mode": "ASCENDING" }
      ]
    }
  ]
}
```

---

## CONFIGURATION FILES

### **Backend package.json** ✓ EXISTS (Needs Updates)

```json
{
  "name": "emergency-backend",
  "version": "1.0.0",
  "description": "Backend for Emergency Alert System",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "seed": "node scripts/seed-database.js",
    "docs": "node scripts/generate-docs.js"
  },
  "keywords": ["emergency", "firebase", "socket.io", "express"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "firebase-admin": "^12.3.0",
    "socket.io": "^4.7.2",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "multer": "^1.4.5-lts.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "express-validator": "^7.0.1",
    "winston": "^3.11.0",
    "nodemailer": "^6.9.7",
    "twilio": "^4.19.0",
    "node-cron": "^3.0.3",
    "pdfkit": "^0.14.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.55.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.29.0"
  }
}
```

### **.env.example** (NEW - Critical)

```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Google Maps API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=logs/

# Database
DB_BACKUP_ENABLED=true
DB_BACKUP_SCHEDULE=0 0 * * *
```

### **.gitignore** (NEW - Critical)

```gitignore
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment Variables
.env
.env.local
.env.production

# Firebase
serviceAccountKey.json
firebase-debug.log
.firebase/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Uploads
uploads/
temp/

# Testing
coverage/
.nyc_output/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/

# Misc
*.pem
.cache/
```

### **firebase.json** (NEW - for Firebase Hosting)

```json
{
  "hosting": {
    "public": "app",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "database/firestore/security-rules.json",
    "indexes": "database/firestore/indexes.json"
  },
  "storage": {
    "rules": "database/storage-rules.txt"
  }
}
```

### **README.md** (UPDATE)

```markdown
# Emergency Rescue Management System

## Overview
Comprehensive disaster response coordination platform with real-time communication.

## Features
- Emergency alert submission with geolocation
- Real-time volunteer coordination
- Administrative command center
- Inventory management (medicine, food, vehicles, shelter, equipment)
- Analytics dashboard with heat map
- Live chat and notifications

## Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** Firebase Firestore
- **Real-time:** Socket.IO
- **Authentication:** Firebase Auth

## Installation

### Prerequisites
- Node.js v16+
- Firebase account
- Google Maps API key (for maps)

### Backend Setup
```bash
cd emergency-backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup
```bash
# Serve with any static server
cd app
# Using Python
python -m http.server 3000
# OR using Node.js http-server
npx http-server -p 3000
```

## Configuration

1. Create Firebase project
2. Download service account key
3. Enable Firestore, Auth, Storage
4. Update .env file
5. Deploy security rules

## API Documentation
See `docs/api/swagger.yaml`

## Testing
```bash
npm test
```

## Deployment
```bash
npm run deploy
```

## License
MIT
```

---

## FILES TO CREATE - PRIORITY ORDER

### **CRITICAL (Start Here)**

1. **Backend Configuration**
   - [ ] `.env.example`
   - [ ] `.gitignore`
   - [ ] `app.js`
   - [ ] `config/multer.js`
   - [ ] `config/cors.js`

2. **Authentication System**
   - [ ] `routes/authRoutes.js`
   - [ ] `controllers/authController.js`
   - [ ] `services/authService.js`
   - [ ] `middleware/errorHandler.js`
   - [ ] `middleware/validator.js`

3. **File Upload**
   - [ ] `routes/uploadRoutes.js`
   - [ ] `controllers/uploadController.js`
   - [ ] `services/storageService.js`
   - [ ] `middleware/uploadMiddleware.js`

4. **Frontend Core**
   - [ ] `app/js/config.js`
   - [ ] `app/js/auth.js`
   - [ ] `app/js/socket-client.js`
   - [ ] `app/js/api.js`
   - [ ] `app/js/utils.js`

5. **Volunteer Portal**
   - [ ] `app/volunteer-portal.html`
   - [ ] `app/js/volunteer.js`
   - [ ] `app/css/volunteer.css`

### **HIGH PRIORITY**

6. **Inventory System**
   - [ ] `routes/inventoryRoutes.js`
   - [ ] `controllers/inventoryController.js`
   - [ ] `models/inventoryModel.js`

7. **Analytics System**
   - [ ] `routes/analyticsRoutes.js`
   - [ ] `controllers/analyticsController.js`
   - [ ] `services/analyticsService.js`

8. **Notifications**
   - [ ] `services/emailService.js`
   - [ ] `services/smsService.js`
   - [ ] `app/js/notification.js`

9. **Database Configuration**
   - [ ] `database/firestore/security-rules.json`
   - [ ] `database/firestore/indexes.json`
   - [ ] `database/firestore/seed-data.json`

10. **Socket.IO Enhancement**
    - [ ] `sockets/handlers/requestHandler.js`
    - [ ] `sockets/handlers/volunteerHandler.js`
    - [ ] `sockets/handlers/chatHandler.js`
    - [ ] `sockets/middleware/socketAuth.js`

### **MEDIUM PRIORITY**

11. **Reporting System**
    - [ ] `routes/reportRoutes.js`
    - [ ] `controllers/reportController.js`
    - [ ] `services/reportService.js`

12. **Middleware**
    - [ ] `middleware/rateLimit.js`
    - [ ] `middleware/logger.js`

13. **Utilities**
    - [ ] `utils/constants.js`
    - [ ] `utils/helpers.js`
    - [ ] `utils/errorCodes.js`
    - [ ] `utils/responseFormatter.js`
    - [ ] `services/geolocationService.js`

14. **Frontend Enhancements**
    - [ ] `app/index.html`
    - [ ] `app/css/main.css`
    - [ ] `app/js/map.js`
    - [ ] `app/js/validation.js`

### **LOW PRIORITY (Polish)**

15. **Testing**
    - [ ] `tests/setup.js`
    - [ ] `tests/unit/controllers/*.test.js`
    - [ ] `tests/integration/api/*.test.js`

16. **Documentation**
    - [ ] `docs/api/swagger.yaml`
    - [ ] `docs/deployment/deployment-guide.md`
    - [ ] `docs/development/coding-standards.md`

17. **Scripts**
    - [ ] `scripts/setup.sh`
    - [ ] `scripts/deploy.sh`
    - [ ] `scripts/seed-database.js`

18. **CI/CD**
    - [ ] `.github/workflows/ci.yml`
    - [ ] `.github/workflows/deploy.yml`

---

## QUICK START CHECKLIST

### Week 1: Foundation
- [ ] Create `.env` and configure Firebase
- [ ] Create `app.js` and modularize Express setup
- [ ] Implement `authRoutes` and `authController`
- [ ] Create frontend `config.js` and `auth.js`
- [ ] Test authentication flow end-to-end

### Week 2: File Upload & API Alignment
- [ ] Implement file upload middleware and routes
- [ ] Fix API endpoint mismatch (user_page.html)
- [ ] Create `uploadController` and `storageService`
- [ ] Test file uploads to Firebase Storage

### Week 3: Real-time Features
- [ ] Create Socket.IO event handlers
- [ ] Implement `socket-client.js` in frontend
- [ ] Connect admin dashboard to Socket.IO
- [ ] Test real-time notifications

### Week 4: Inventory & Analytics
- [ ] Create inventory routes and controllers
- [ ] Connect frontend inventory pages to backend
- [ ] Implement analytics endpoints
- [ ] Build heat map data API

### Week 5: Volunteer Portal
- [ ] Create volunteer-portal.html
- [ ] Implement volunteer task assignment logic
- [ ] Add proximity-based volunteer matching
- [ ] Test volunteer workflow

### Week 6: Testing & Deployment
- [ ] Write unit tests for critical functions
- [ ] Perform integration testing
- [ ] Deploy to Firebase/Heroku
- [ ] User acceptance testing

---

## DETAILED FILE TEMPLATES

Would you like me to generate the actual code for any of these files? I can create:
- Complete route files with all endpoints
- Controller implementations with business logic
- Service layer functions
- Frontend JavaScript modules
- Database models and schemas
- Middleware implementations
- Configuration files

Just let me know which files you'd like me to create first!

---

**END OF ARCHITECTURE DOCUMENT**

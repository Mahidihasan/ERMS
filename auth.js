// auth.js - Firebase Authentication Implementation

// Authentication state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in:', user.email);
        // User is signed in, check if we need to redirect
        const currentPage = window.location.pathname;
        if (currentPage.includes('login.html') || currentPage.includes('register.html')) {
            redirectBasedOnRole(user);
        }
    } else {
        console.log('User is signed out');
        // User is signed out, redirect to login if not already there
        const currentPage = window.location.pathname;
        if (!currentPage.includes('login.html') && !currentPage.includes('register.html')) {
            window.location.href = 'login.html';
        }
    }
});

// Firebase Login function
async function firebaseLogin(email, password, rememberMe = false) {
    try {
        showNotification('Logging in...', 'info');
        
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Get additional user data from Firestore
        const userData = await firestoreService.getUser(user.uid);
        
        if (!userData) {
            throw new Error('User data not found');
        }

        // Store user session
        const sessionUser = {
            uid: user.uid,
            email: user.email,
            name: userData.name,
            role: userData.role,
            phone: userData.phone,
            token: await user.getIdToken()
        };

        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(sessionUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));
        }

        showNotification('Login successful!', 'success');
        
        // Redirect based on role
        redirectBasedOnRole(sessionUser);
        
        return sessionUser;
        
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. ';
        
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/user-disabled':
                errorMessage += 'This account has been disabled.';
                break;
            case 'auth/user-not-found':
                errorMessage += 'No account found with this email.';
                break;
            case 'auth/wrong-password':
                errorMessage += 'Incorrect password.';
                break;
            default:
                errorMessage += error.message;
        }
        
        showNotification(errorMessage, 'error');
        return null;
    }
}

// Firebase Register function
async function firebaseRegister(userData) {
    try {
        showNotification('Creating account...', 'info');

        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(
            userData.email, 
            userData.password
        );
        const user = userCredential.user;

        // Prepare user data for Firestore
        const firestoreUserData = {
            name: userData.name,
            email: userData.email,
            role: userData.role,
            phone: userData.phone,
            address: userData.address || '',
            skills: userData.skills || [],
            status: 'active'
        };

        // Store user data in Firestore
        await firestoreService.createUser(user.uid, firestoreUserData);

        // If volunteer, register in volunteers collection
        if (userData.role === 'volunteer') {
            await firestoreService.registerVolunteer({
                userId: user.uid,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                skills: userData.skills || [],
                location: userData.location || '',
                status: 'available'
            });
        }

        showNotification('Registration successful! You can now login.', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

        return user;

    } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = 'Registration failed. ';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'Email already registered.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/weak-password':
                errorMessage += 'Password is too weak.';
                break;
            default:
                errorMessage += error.message;
        }
        
        showNotification(errorMessage, 'error');
        return null;
    }
}

// Firebase Logout function
async function firebaseLogout() {
    try {
        await auth.signOut();
        
        // Clear local storage
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        
        showNotification('Logged out successfully', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Logout failed', 'error');
    }
}

// Password reset function
async function resetPassword(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        showNotification('Password reset email sent! Check your inbox.', 'success');
        return true;
    } catch (error) {
        console.error('Password reset error:', error);
        showNotification('Failed to send reset email: ' + error.message, 'error');
        return false;
    }
}

// Get current user function (updated for Firebase)
function getCurrentUser() {
    // Check localStorage first, then sessionStorage
    const userData = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (userData) {
        return JSON.parse(userData);
    }
    
    // If no stored data, check Firebase auth state
    const currentUser = auth.currentUser;
    if (currentUser) {
        return {
            uid: currentUser.uid,
            email: currentUser.email
        };
    }
    
    return null;
}

// Redirect based on user role
function redirectBasedOnRole(user) {
    if (!user || !user.role) {
        window.location.href = 'login.html';
        return;
    }

    const currentPage = window.location.pathname;
    
    switch (user.role) {
        case 'admin':
        case 'super_admin':
        case 'director':
            if (!currentPage.includes('admin.html')) {
                window.location.href = 'admin.html';
            }
            break;
        case 'volunteer':
            if (!currentPage.includes('volunteer.html')) {
                window.location.href = 'volunteer.html';
            }
            break;
        default:
            window.location.href = 'login.html';
    }
}

// Update user profile
async function updateUserProfile(updates) {
    try {
        const user = getCurrentUser();
        if (!user) {
            throw new Error('No user logged in');
        }

        await firestoreService.updateUser(user.uid, updates);
        
        // Update local storage
        const currentUser = getCurrentUser();
        const updatedUser = { ...currentUser, ...updates };
        
        if (localStorage.getItem('currentUser')) {
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }

        showNotification('Profile updated successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Profile update error:', error);
        showNotification('Failed to update profile: ' + error.message, 'error');
        return false;
    }
}

// Export functions for global access
window.firebaseLogin = firebaseLogin;
window.firebaseRegister = firebaseRegister;
window.firebaseLogout = firebaseLogout;
window.resetPassword = resetPassword;
window.getCurrentUser = getCurrentUser;
window.updateUserProfile = updateUserProfile;
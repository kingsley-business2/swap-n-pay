// auth.js - Authentication System for Swap N Stay

// Global authentication state
let currentUser = null;

// DOM Elements
const authButtons = document.getElementById('auth-buttons');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');

// Initialize Auth
function initAuth() {
    // Set up auth state observer
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            currentUser = user;
            updateAuthUI();
            console.log('User signed in:', user.email);
        } else {
            // User is signed out
            currentUser = null;
            updateAuthUI();
            console.log('User signed out');
        }
    });
}

// Update UI based on auth state
function updateAuthUI() {
    if (currentUser) {
        // User is logged in
        if (authButtons) authButtons.classList.add('hidden');
        if (userInfo) userInfo.classList.remove('hidden');
        if (userName) userName.textContent = currentUser.displayName || currentUser.email;
    } else {
        // User is logged out
        if (authButtons) authButtons.classList.remove('hidden');
        if (userInfo) userInfo.classList.add('hidden');
    }
}

// Sign up new user
async function signUp(email, password, name, phone) {
    try {
        // Create user with email and password
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

        // Update profile with display name
        await userCredential.user.updateProfile({
            displayName: name
        });

        // Send email verification
        await userCredential.user.sendEmailVerification();

        // Create user document in Firestore
        await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
            name: name,
            email: email,
            phone: phone,
            tier: 'free',
            monthlyPostValue: 0,
            accountCreatedAt: new Date(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Sign up error:', error);
        return { success: false, error: error.message };
    }
}

// Sign in existing user
async function signIn(email, password) {
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
    }
}

// Sign out user
async function signOut() {
    try {
        await firebase.auth().signOut();
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
}

// Password reset
async function resetPassword(email) {
    try {
        await firebase.auth().sendPasswordResetEmail(email);
        return { success: true };
    } catch (error) {
        console.error('Password reset error:', error);
        return { success: false, error: error.message };
    }
}

// Get current user data from Firestore
async function getCurrentUserData() {
    if (!currentUser) return null;

    try {
        const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

// Check if user is admin (you can expand this later)
function isAdmin() {
    // For now, you can hardcode your admin email
    // Later we'll implement a proper admin system
    const adminEmails = ['knsleybusiness@gmail.com']; // Add your email here
    return currentUser && adminEmails.includes(currentUser.email);
}

// Prevent multiple auth initializations
let authInitialized = false;

// Initialize auth when the app starts
document.addEventListener('DOMContentLoaded', function() {
    if (authInitialized) return;

    // Wait a moment for Firebase to initialize
    setTimeout(() => {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0 && !authInitialized) {
            authInitialized = true;
            initAuth();
        } else {
            console.warn('Firebase not initialized yet');
            // Try again after a delay
            setTimeout(() => {
                if (!authInitialized) {
                    authInitialized = true;
                    initAuth();
                }
            }, 1000);
        }
    }, 500);
});

// Make functions available globally
window.auth = {
    signUp,
    signIn,
    signOut,
    resetPassword,
    getCurrentUserData,
    isAdmin,
    getCurrentUser: () => currentUser
};

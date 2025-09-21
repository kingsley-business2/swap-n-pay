// app.js - Main Application Logic for Swap N Stay

// DOM Elements for Auth Modals - will be retrieved when needed
let loginModal, signupModal, loginForm, signupForm, showLoginBtn, showSignupBtn, closeLoginBtn, closeSignupBtn;

// Initialize the application
function initializeApp() {
    console.log('Initializing Swap N Stay app...');

    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupEventListeners();
            initializeProducts();
        });
    } else {
        setupEventListeners();
        initializeProducts();
    }
}

// Initialize products based on auth state
function initializeProducts() {
    // Initialize products if user is logged in
    if (typeof auth !== 'undefined' && auth.getCurrentUser()) {
        console.log('User is logged in, initializing products...');
        if (typeof products !== 'undefined' && products.initProducts) {
            products.initProducts();
        }
    } else {
        console.log('User not logged in, products will load after authentication');
        // Load demo data or show public view
        if (typeof products !== 'undefined' && products.loadDemoData) {
            products.loadDemoData();
        }
    }

    console.log('App initialization complete');
}

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Auth button listeners
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    
    console.log('Login button found:', !!loginBtn);
    console.log('Signup button found:', !!signupBtn);
    
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔵 Login button clicked! Event triggered successfully');
            const modal = document.getElementById('login-modal');
            console.log('🔵 Login modal found:', !!modal);
            if (modal) {
                // Force modal to show with multiple methods
                modal.style.display = 'flex !important';
                modal.style.visibility = 'visible';
                modal.style.opacity = '1';
                modal.classList.remove('hidden');
                modal.removeAttribute('hidden');
                console.log('🔵 Modal should be visible now');
                console.log('🔵 Modal computed style:', window.getComputedStyle(modal).display);
            } else {
                console.error('❌ Login modal not found');
            }
        });
        console.log('✅ Login button event listener attached successfully');
    } else {
        console.error('❌ Login button not found - you may be on the wrong page');
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔵 Signup button clicked! Event triggered successfully');
            const modal = document.getElementById('signup-modal');
            console.log('🔵 Signup modal found:', !!modal);
            if (modal) {
                // Force modal to show with multiple methods
                modal.style.display = 'flex !important';
                modal.style.visibility = 'visible';
                modal.style.opacity = '1';
                modal.classList.remove('hidden');
                modal.removeAttribute('hidden');
                console.log('🔵 Signup modal should be visible now');
            } else {
                console.error('❌ Signup modal not found');
            }
        });
        console.log('✅ Signup button event listener attached successfully');
    } else {
        console.error('❌ Signup button not found');
    }

    if (document.getElementById('logout-btn')) {
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
    }

    // Modal navigation listeners
    const showLoginBtn = document.getElementById('show-login');
    const showSignupBtn = document.getElementById('show-signup');
    const closeLoginBtn = document.getElementById('close-login');
    const closeSignupBtn = document.getElementById('close-signup');

    if (showLoginBtn) showLoginBtn.addEventListener('click', () => {
        const signup = document.getElementById('signup-modal');
        const login = document.getElementById('login-modal');
        if (signup) hideModal(signup);
        if (login) showModal(login);
    });

    if (showSignupBtn) showSignupBtn.addEventListener('click', () => {
        const login = document.getElementById('login-modal');
        const signup = document.getElementById('signup-modal');
        if (login) hideModal(login);
        if (signup) showModal(signup);
    });

    if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => {
        const modal = document.getElementById('login-modal');
        if (modal) hideModal(modal);
    });
    
    if (closeSignupBtn) closeSignupBtn.addEventListener('click', () => {
        const modal = document.getElementById('signup-modal');
        if (modal) hideModal(modal);
    });

    // Form submission listeners
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);

    // Existing navigation listeners (from your original code)
    if (document.getElementById('view-products-link')) {
        document.getElementById('view-products-link').addEventListener('click', (e) => {
            e.preventDefault();
            showProductsView();
        });
    }

    if (document.getElementById('edit-profile-link')) {
        document.getElementById('edit-profile-link').addEventListener('click', (e) => {
            e.preventDefault();
            showProfileView();
        });
    }

    // Existing form listeners (from your original code)
    if (document.getElementById('productForm')) {
        document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    }

    if (document.getElementById('profileForm')) {
        document.getElementById('profileForm').addEventListener('submit', handleProfileSubmit);
    }

    if (document.getElementById('editForm')) {
        document.getElementById('editForm').addEventListener('submit', handleEditSubmit);
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        const loginModal = document.getElementById('login-modal');
        const signupModal = document.getElementById('signup-modal');
        if (e.target === loginModal) hideModal(loginModal);
        if (e.target === signupModal) hideModal(signupModal);
    });
}

// Modal functions
function showModal(modal) {
    if (modal) {
        modal.style.display = 'flex !important';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.classList.remove('hidden');
        modal.removeAttribute('hidden');
        console.log('Modal forced to display');
    }
}

function hideModal(modal) {
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

// Auth handler functions
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    const result = await auth.signIn(email, password);

    if (result.success) {
        showMessage('Login successful!', 'success');
        const modal = document.getElementById('login-modal');
        const form = document.getElementById('login-form');
        if (modal) hideModal(modal);
        if (form) form.reset();

        // Initialize products after successful login
        if (typeof products !== 'undefined' && products.initProducts) {
            products.initProducts();
        }
    } else {
        showMessage('Login failed: ' + result.error, 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    // Basic validation
    if (!name || !email || !phone || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }

    const result = await auth.signUp(email, password, name, phone);

    if (result.success) {
        showMessage('Account created successfully! Please check your email for verification.', 'success');
        const modal = document.getElementById('signup-modal');
        const form = document.getElementById('signup-form');
        if (modal) hideModal(modal);
        if (form) form.reset();

        // Initialize products after successful signup
        if (typeof products !== 'undefined' && products.initProducts) {
            products.initProducts();
        }
    } else {
        showMessage('Signup failed: ' + result.error, 'error');
    }
}

async function handleLogout() {
    const result = await auth.signOut();

    if (result.success) {
        showMessage('Logged out successfully', 'success');
        // Reload demo data or clear products view
        if (typeof products !== 'undefined' && products.loadDemoData) {
            products.loadDemoData();
        }
    } else {
        showMessage('Logout failed: ' + result.error, 'error');
    }
}

// Keep your existing functions from the original script
// Navigation functions
function showProductsView() {
    const productsView = document.getElementById('products-view');
    const profileView = document.getElementById('profile-view');
    const productsLink = document.getElementById('view-products-link');
    const profileLink = document.getElementById('edit-profile-link');

    if (productsView) productsView.classList.remove('hidden');
    if (profileView) profileView.classList.add('hidden');
    if (productsLink) productsLink.classList.add('tab-active');
    if (profileLink) profileLink.classList.remove('tab-active');
}

function showProfileView() {
    const productsView = document.getElementById('products-view');
    const profileView = document.getElementById('profile-view');
    const productsLink = document.getElementById('view-products-link');
    const profileLink = document.getElementById('edit-profile-link');

    if (productsView) productsView.classList.add('hidden');
    if (profileView) profileView.classList.remove('hidden');
    if (productsLink) productsLink.classList.remove('tab-active');
    if (profileLink) profileLink.classList.add('tab-active');
}

// Message function
function showMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');

    if (messageText && messageBox) {
        messageText.textContent = message;
        messageText.className = `alert alert-${type === 'error' ? 'error' : 'success'}`;
        messageBox.classList.remove('hidden');

        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    } else {
        alert(message); // Fallback if message elements don't exist
    }
}

// Product form handler (connects to products.js)
async function handleProductSubmit(e) {
    e.preventDefault();

    if (typeof products !== 'undefined' && products.handleProductSubmit) {
        await products.handleProductSubmit(e);
    } else {
        showMessage('Products system not loaded yet', 'error');
    }
}

// Profile form handler
function handleProfileSubmit(e) {
    e.preventDefault();
    // Your existing profile handling code
    const profileData = {
        name: document.getElementById('profileName').value,
        role: document.getElementById('profileRole').value,
        contact: document.getElementById('profileContact').value
    };

    localStorage.setItem('userProfile', JSON.stringify(profileData));
    showMessage('Profile saved successfully!', 'success');
}

// Edit form handler
async function handleEditSubmit(e) {
    e.preventDefault();
    // Your existing edit handling code
    showMessage('Edit functionality coming soon!', 'info');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing app...');
    
    // Immediately try to setup event listeners since DOM is ready
    setupEventListeners();
    
    // Wait for Firebase to initialize for other features
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            clearInterval(checkFirebase);
            initializeProducts();
        }
    }, 100);

    // Fallback after 5 seconds
    setTimeout(() => {
        clearInterval(checkFirebase);
        initializeProducts();
    }, 5000);
});

// Keep your existing utility functions here if needed...
// (editProduct, confirmDelete, loadProfile, etc. from your original code)

// Make functions available globally if needed
window.app = {
    initializeApp,
    showModal,
    hideModal,
    showMessage
};

// Immediate setup - run as soon as script loads
(function immediateSetup() {
    console.log('Running immediate setup...');
    
    // Try to setup event listeners immediately
    if (document.getElementById('login-btn')) {
        console.log('DOM elements found, setting up listeners immediately');
        setupEventListeners();
    } else {
        console.log('DOM elements not ready yet, waiting for DOMContentLoaded');
    }
})();

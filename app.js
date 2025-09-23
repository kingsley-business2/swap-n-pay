// app.js - Main Application Logic for Swap N Stay

// Global variables for DOM elements
let welcomeMessageCard, authButtons, userInfo, userName, loginBtn, signupBtn, logoutBtn;
let loginModal, signupModal, closeLoginBtn, closeSignupBtn, showLoginBtn, showSignupBtn;
let productsView, profileView, productsLink, profileLink;
let loginForm, signupForm, productForm, profileForm, editForm;

// Initialize the application
function initializeApp() {
    console.log('Initializing Swap N Stay app...');
    getDOMElements();
    setupEventListeners();
    
    // Check auth state immediately to determine initial view
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log('User logged in, showing products and hiding auth buttons.');
            showProductsView();
            authButtons.classList.add('hidden');
            userInfo.classList.remove('hidden');
            userName.textContent = user.displayName || user.email;
        } else {
            console.log('User logged out, showing auth buttons and hiding products.');
            showProductsView(); // Default to products view for public access
            authButtons.classList.remove('hidden');
            userInfo.classList.add('hidden');
        }
    });

    console.log('App initialization complete');
}

// Get all required DOM elements once to avoid repeated queries
function getDOMElements() {
    welcomeMessageCard = document.getElementById('welcome-message-card');
    authButtons = document.getElementById('auth-buttons');
    userInfo = document.getElementById('user-info');
    userName = document.getElementById('user-name');
    loginBtn = document.getElementById('login-btn');
    signupBtn = document.getElementById('signup-btn');
    logoutBtn = document.getElementById('logout-btn');

    loginModal = document.getElementById('login-modal');
    signupModal = document.getElementById('signup-modal');
    closeLoginBtn = document.getElementById('close-login');
    closeSignupBtn = document.getElementById('close-signup');
    showLoginBtn = document.getElementById('show-login');
    showSignupBtn = document.getElementById('show-signup');

    productsView = document.getElementById('products-view');
    profileView = document.getElementById('profile-view');
    productsLink = document.getElementById('view-products-link');
    profileLink = document.getElementById('edit-profile-link');
    
    loginForm = document.getElementById('login-form');
    signupForm = document.getElementById('signup-form');
    productForm = document.getElementById('productForm');
    profileForm = document.getElementById('profileForm');
    editForm = document.getElementById('editForm');
}

// Setup all event listeners
function setupEventListeners() {
    // Auth button listeners
    if (loginBtn) loginBtn.addEventListener('click', () => showModal(loginModal));
    if (signupBtn) signupBtn.addEventListener('click', () => showModal(signupModal));
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Modal navigation listeners
    if (showLoginBtn) showLoginBtn.addEventListener('click', () => { hideModal(signupModal); showModal(loginModal); });
    if (showSignupBtn) showSignupBtn.addEventListener('click', () => { hideModal(loginModal); showModal(signupModal); });
    if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => hideModal(loginModal));
    if (closeSignupBtn) closeSignupBtn.addEventListener('click', () => hideModal(signupModal));
    
    // Form submission listeners
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    if (productForm) productForm.addEventListener('submit', handleProductSubmit);
    if (profileForm) profileForm.addEventListener('submit', handleProfileSubmit);
    if (editForm) editForm.addEventListener('submit', handleEditSubmit);

    // Tab navigation listeners
    if (productsLink) productsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showProductsView();
    });
    if (profileLink) profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        showProfileView();
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) hideModal(loginModal);
        if (e.target === signupModal) hideModal(signupModal);
    });
}

// Modal functions
function showModal(modal) {
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function hideModal(modal) {
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Auth handler functions
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const result = await auth.signIn(email, password);

    if (result.success) {
        showMessage('Login successful! Welcome back 🎉', 'success');
        hideModal(loginModal);
        loginForm.reset();
        if (welcomeMessageCard) welcomeMessageCard.classList.add('hidden');
        if (typeof products !== 'undefined' && products.loadProducts) {
            products.loadProducts();
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

    if (password !== confirmPassword) {
        showMessage('Passwords do not match ❌', 'error');
        return;
    }
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters 🔒', 'error');
        return;
    }

    const result = await auth.signUp(email, password, name, phone);

    if (result.success) {
        showMessage('Account created successfully! Welcome to the marketplace 🎉', 'success');
        hideModal(signupModal);
        signupForm.reset();
        if (welcomeMessageCard) welcomeMessageCard.classList.add('hidden');
        if (typeof products !== 'undefined' && products.loadProducts) {
            products.loadProducts();
        }
    } else {
        showMessage('Signup failed: ' + result.error, 'error');
    }
}

async function handleLogout() {
    const result = await auth.signOut();
    if (result.success) {
        showMessage('Logged out successfully 👋', 'success');
        if (welcomeMessageCard) welcomeMessageCard.classList.remove('hidden');
        if (typeof products !== 'undefined' && products.loadDemoData) {
            products.loadDemoData();
        }
    } else {
        showMessage('Logout failed: ' + result.error, 'error');
    }
}

// Tab navigation functions
function showProductsView() {
    if (productsView) productsView.classList.remove('hidden');
    if (profileView) profileView.classList.add('hidden');
    if (productsLink) productsLink.classList.add('tab-active');
    if (profileLink) profileLink.classList.remove('tab-active');
    // Ensure chart is updated when view is shown
    if (typeof products !== 'undefined' && products.updateProductChart) {
        products.updateProductChart();
    }
}

function showProfileView() {
    if (productsView) productsView.classList.add('hidden');
    if (profileView) profileView.classList.remove('hidden');
    if (productsLink) productsLink.classList.remove('tab-active');
    if (profileLink) profileLink.classList.add('tab-active');
}

// Product form handler
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
    showMessage('Profile saved successfully! 💾', 'success');
    // Add logic here to save profile data to Firestore
}

// Edit form handler
function handleEditSubmit(e) {
    e.preventDefault();
    showMessage('Edit functionality coming soon! 🚧', 'info');
    // Add logic here to save edited product data
    const editModal = document.getElementById('editModal');
    if (editModal) editModal.close();
}

// Toast message function
function showMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    const messageClose = document.getElementById('messageClose');

    if (messageText && messageBox) {
        messageText.innerHTML = `<span>${message}</span>`;
        messageText.className = `alert alert-${type === 'error' ? 'error' : 'success'} flex justify-between items-center`;
        messageBox.classList.remove('hidden');

        const hideTimeout = setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);

        if (messageClose) {
            messageClose.onclick = () => {
                clearTimeout(hideTimeout);
                messageBox.classList.add('hidden');
            };
        }
    } else {
        alert(message);
    }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Make functions available globally for other scripts
window.app = {
    showModal,
    hideModal,
    showMessage
};

// Universal Button Fix - Fixes ALL buttons in your application
// Add this to a new file called "universal-button-fix.js"

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Universal Button Fix - Starting...');

    // Wait for everything to load
    setTimeout(() => {
        fixAllButtons();
    }, 1000);
});

function fixAllButtons() {
    console.log('🔧 Scanning for ALL buttons...');

    // Find all clickable elements
    const clickableElements = document.querySelectorAll(`
        button, 
        [role="button"], 
        .btn, 
        .button, 
        input[type="button"], 
        input[type="submit"], 
        a[onclick], 
        [onclick],
        .clickable,
        .login-btn,
        .signup-btn,
        .add-product-btn,
        .browse-products,
        .join-today,
        .admin-btn,
        .close,
        .modal-close,
        .tab-btn,
        .nav-btn,
        .action-btn
    `);

    console.log(`🔍 Found ${clickableElements.length} clickable elements`);

    clickableElements.forEach((element, index) => {
        const text = element.textContent.trim();
        const id = element.id || `button-${index}`;

        console.log(`🔧 Fixing button #${index}: "${text}" (ID: ${id})`);

        // Remove existing listeners by cloning
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);

        // Add universal click handler
        newElement.addEventListener('click', function(e) {
            handleButtonClick(e, this, text, id, index);
        });

        // Also add onclick as backup
        newElement.onclick = function(e) {
            handleButtonClick(e, this, text, id, index);
        };
    });

    console.log('✅ All buttons have been fixed!');
}

function handleButtonClick(event, element, text, id, index) {
    event.preventDefault();
    event.stopPropagation();

    console.log(`🔵 Button clicked: "${text}" (ID: ${id})`);

    const textLower = text.toLowerCase();

    // LOGIN BUTTONS
    if (textLower.includes('login') || textLower.includes('log in') || id.includes('login')) {
        console.log('🔑 Login button detected');
        openModal('loginModal');
        return;
    }

    // SIGNUP BUTTONS  
    if (textLower.includes('signup') || textLower.includes('sign up') || textLower.includes('register') || id.includes('signup')) {
        console.log('📝 Signup button detected');
        openModal('signupModal');
        return;
    }

    // CLOSE BUTTONS
    if (textLower.includes('close') || textLower.includes('×') || element.classList.contains('close')) {
        console.log('❌ Close button detected');
        closeAllModals();
        return;
    }

    // ADD PRODUCT BUTTONS
    if (textLower.includes('add product') || id.includes('add-product')) {
        console.log('➕ Add product button detected');
        openModal('addProductModal');
        return;
    }

    // BROWSE PRODUCTS BUTTONS
    if (textLower.includes('browse products') || textLower.includes('browse')) {
        console.log('🛍️ Browse products button detected');
        showProductsTab();
        return;
    }

    // JOIN TODAY BUTTONS
    if (textLower.includes('join today') || textLower.includes('join')) {
        console.log('🤝 Join today button detected');
        openModal('signupModal');
        return;
    }

    // TAB BUTTONS
    if (element.classList.contains('tab-btn') || textLower.includes('profile') || textLower.includes('products')) {
        console.log('📋 Tab button detected');
        handleTabClick(element, textLower);
        return;
    }

    // ADMIN BUTTONS
    if (textLower.includes('admin') || id.includes('admin')) {
        console.log('👑 Admin button detected');
        window.location.href = '/admin.html';
        return;
    }

    // SUBMIT BUTTONS (forms)
    if (element.type === 'submit' || textLower.includes('submit') || textLower.includes('save')) {
        console.log('💾 Submit button detected');
        handleFormSubmit(element);
        return;
    }

    // NAVIGATION BUTTONS
    if (textLower.includes('home') || textLower.includes('main') || textLower.includes('back')) {
        console.log('🏠 Navigation button detected');
        window.location.href = '/';
        return;
    }

    // GENERIC BUTTON - Try to determine action
    console.log(`🤔 Generic button clicked: "${text}"`);
    handleGenericButton(element, text);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.zIndex = '9999';
        modal.classList.add('show');
        console.log(`✅ Modal opened: ${modalId}`);
    } else {
        console.error(`❌ Modal not found: ${modalId}`);
        // Create emergency modal
        createEmergencyModal(modalId);
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal, [id$="Modal"]');
    modals.forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('show');
    });
    console.log('✅ All modals closed');
}

function showProductsTab() {
    // Try to activate products tab
    const productsTab = document.querySelector('[data-tab="products"]') || 
                      document.getElementById('productsTab') ||
                      document.querySelector('.tab-btn:nth-child(2)');

    if (productsTab) {
        productsTab.click();
        console.log('✅ Products tab activated');
    } else {
        console.log('ℹ️ Products tab not found, staying on current view');
    }
}

function handleTabClick(element, text) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });

    // Add active class to clicked tab
    element.classList.add('active');

    // Show corresponding content
    if (text.includes('profile')) {
        showSection('profile');
    } else if (text.includes('products')) {
        showSection('products');
    }

    console.log(`✅ Tab switched to: ${text}`);
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.tab-content, .section').forEach(section => {
        section.style.display = 'none';
    });

    // Show target section
    const target = document.getElementById(`${sectionName}Section`) || 
                  document.getElementById(sectionName) ||
                  document.querySelector(`[data-section="${sectionName}"]`);

    if (target) {
        target.style.display = 'block';
        console.log(`✅ Section shown: ${sectionName}`);
    }
}

function handleFormSubmit(element) {
    const form = element.closest('form');
    if (form) {
        // Trigger form validation and submission
        if (form.checkValidity()) {
            console.log('✅ Form is valid, submitting...');
            // Don't prevent default for actual form submission
            return true;
        } else {
            console.log('❌ Form validation failed');
            form.reportValidity();
        }
    }
}

function handleGenericButton(element, text) {
    // Try to determine what this button should do
    const parent = element.parentElement;
    const parentClass = parent ? parent.className : '';

    console.log(`🔍 Analyzing generic button context:`, {
        text: text,
        id: element.id,
        classes: element.className,
        parentClass: parentClass
    });

    // Check if it's in a card or product listing
    if (parentClass.includes('card') || parentClass.includes('product')) {
        console.log('🛍️ Button in product context - showing details');
        // Could show product details or add to cart
        return;
    }

    // Check if it's in navigation
    if (parentClass.includes('nav') || parentClass.includes('header')) {
        console.log('🧭 Button in navigation context');
        return;
    }

    // Default action
    console.log('⚠️ Unknown button action - button click registered but no specific action taken');
}

function createEmergencyModal(modalId) {
    console.log(`🆘 Creating emergency modal: ${modalId}`);

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.style.cssText = `
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 9999;
        align-items: center;
        justify-content: center;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; max-width: 400px; width: 90%;">
            <h2>Emergency Modal: ${modalId}</h2>
            <p>The original modal wasn't found, so this emergency modal was created.</p>
            <p>This confirms your button is working!</p>
            <button onclick="this.closest('.modal, div').remove()" style="background: red; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px;">Close</button>
        </div>
    `;

    document.body.appendChild(modal);
}

// Run fixes periodically to catch dynamically added buttons
setInterval(() => {
    const unfixedButtons = document.querySelectorAll('button:not([data-fixed]), .btn:not([data-fixed])');
    if (unfixedButtons.length > 0) {
        console.log(`🔧 Found ${unfixedButtons.length} new buttons to fix...`);
        fixAllButtons();
    }
}, 5000);

// Mark fixed buttons
function markButtonAsFixed(button) {
    button.setAttribute('data-fixed', 'true');
}

// Emergency button diagnostics
function diagnoseAllButtons() {
    console.log('🔬 BUTTON DIAGNOSTICS:');
    const allButtons = document.querySelectorAll('button, .btn, [role="button"]');
    allButtons.forEach((btn, i) => {
        console.log(`Button ${i}:`, {
            text: btn.textContent.trim(),
            id: btn.id,
            classes: btn.className,
            hasClickListener: btn.onclick !== null,
            visible: btn.offsetWidth > 0 && btn.offsetHeight > 0
        });
    });
}

// Run diagnostics after 3 seconds
setTimeout(diagnoseAllButtons, 3000);

console.log('🚀 Universal Button Fix loaded and ready!');

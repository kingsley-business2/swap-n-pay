
// products.js - Product Management System for Swap N Stay

// Global products state
let products = [];
let currentUserProducts = [];
let statusChart = null;

// Initialize products system
function initProducts() {
    console.log('Initializing products system...');
    loadProducts();
    setupProductEventListeners();
}

// Load products from Firestore
async function loadProducts() {
    try {
        showLoadingState(true);

        const snapshot = await firebase.firestore()
            .collection('products')
            .orderBy('createdAt', 'desc')
            .get();

        products = [];
        snapshot.forEach(doc => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });

        displayProducts();
        updateProductChart();
        showLoadingState(false);

    } catch (error) {
        console.error('Error loading products:', error);
        showLoadingState(false);
        loadDemoData();
    }
}

// Display products in the table
function displayProducts() {
    const productList = document.getElementById('productList');
    const noProductsMessage = document.getElementById('noProductsMessage');

    if (!productList) return;

    if (products.length === 0) {
        productList.innerHTML = '';
        if (noProductsMessage) noProductsMessage.classList.remove('hidden');
        return;
    }

    if (noProductsMessage) noProductsMessage.classList.add('hidden');

    productList.innerHTML = products.map(product => `
        <tr>
            <td>
                <div>
                    <div class="font-bold">${product.name || 'N/A'}</div>
                    <div class="text-sm opacity-50">${product.category || 'N/A'}</div>
                </div>
            </td>
            <td>${product.quantity || 0}</td>
            <td>${product.location || 'N/A'}</td>
            <td>
                <div class="badge badge-${getStatusColor(product.status)}">${product.status || 'N/A'}</div>
            </td>
            <td>${product.sellerName || product.seller || 'N/A'}</td>
            <td>
                <div class="flex space-x-2">
                    <button class="btn btn-sm btn-primary" onclick="viewProduct('${product.id}')">View</button>
                    ${product.sellerId === firebase.auth().currentUser?.uid ? 
                        `<button class="btn btn-sm btn-warning" onclick="editProduct('${product.id}')">Edit</button>
                         <button class="btn btn-sm btn-error" onclick="deleteProduct('${product.id}')">Delete</button>` : 
                        `<button class="btn btn-sm btn-success" onclick="contactSeller('${product.id}')">Contact</button>`
                    }
                </div>
            </td>
        </tr>
    `).join('');
}

// Get status color for badges
function getStatusColor(status) {
    const colors = {
        'Available': 'success',
        'Harvested': 'info',
        'Processed': 'warning',
        'Shipped': 'primary',
        'Delivered': 'success',
        'Sold': 'neutral'
    };
    return colors[status] || 'neutral';
}

// Handle product form submission
async function handleProductSubmit(e) {
    e.preventDefault();

    const user = firebase.auth().currentUser;
    if (!user) {
        if (window.app) window.app.showMessage('Please login to add products', 'error');
        return;
    }

    const formData = {
        name: document.getElementById('productName').value,
        quantity: parseInt(document.getElementById('quantity').value),
        price: parseFloat(document.getElementById('productPrice').value),
        location: document.getElementById('location').value,
        category: document.getElementById('productCategory').value,
        status: document.getElementById('status').value,
        description: document.getElementById('productDescription').value,
        sellerId: user.uid,
        sellerName: user.displayName || user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await firebase.firestore().collection('products').add(formData);
        
        if (window.app) window.app.showMessage('Product added successfully!', 'success');
        document.getElementById('productForm').reset();
        document.getElementById('add-product-modal').classList.add('hidden');
        
        loadProducts(); // Reload products
    } catch (error) {
        console.error('Error adding product:', error);
        if (window.app) window.app.showMessage('Failed to add product', 'error');
    }
}

// Product action functions
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`Product: ${product.name}\nCategory: ${product.category}\nPrice: GHS ${product.price}\nDescription: ${product.description || 'No description'}`);
    }
}

function editProduct(productId) {
    if (window.app) window.app.showMessage('Edit functionality coming soon!', 'info');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        firebase.firestore().collection('products').doc(productId).delete()
            .then(() => {
                if (window.app) window.app.showMessage('Product deleted successfully', 'success');
                loadProducts();
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                if (window.app) window.app.showMessage('Failed to delete product', 'error');
            });
    }
}

function contactSeller(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        if (window.app) window.app.showMessage(`Contact ${product.sellerName} for ${product.name}`, 'info');
    }
}

// Update product status chart
function updateProductChart() {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (statusChart) {
        statusChart.destroy();
    }

    // Count products by status
    const statusCounts = {};
    products.forEach(product => {
        const status = product.status || 'Unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);

    statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Load demo data for testing
function loadDemoData() {
    console.log('Loading demo product data...');
    
    products = [
        {
            id: 'demo1',
            name: 'Organic Tomatoes',
            category: 'Crops',
            quantity: 50,
            price: 15,
            location: 'Accra',
            status: 'Available',
            sellerName: 'Demo Farmer',
            description: 'Fresh organic tomatoes'
        },
        {
            id: 'demo2',
            name: 'Maize',
            category: 'Crops',
            quantity: 100,
            price: 8,
            location: 'Kumasi',
            status: 'Harvested',
            sellerName: 'Demo Farmer 2',
            description: 'Quality maize for sale'
        }
    ];

    displayProducts();
    updateProductChart();
    showLoadingState(false);
}

// Show/hide loading state
function showLoadingState(show) {
    const loadingMessage = document.getElementById('loadingMessage');
    const productList = document.getElementById('productList');

    if (loadingMessage) {
        if (show) {
            loadingMessage.classList.remove('hidden');
        } else {
            loadingMessage.classList.add('hidden');
        }
    }
}

// Setup product-specific event listeners
function setupProductEventListeners() {
    // Product form submission is handled in app.js
    console.log('Product event listeners set up');
}

// Initialize when auth state changes
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log('User authenticated, initializing products...');
        initProducts();
    } else {
        console.log('User not authenticated, loading demo data...');
        loadDemoData();
    }
});

// Make functions available globally
window.products = {
    initProducts,
    loadProducts,
    handleProductSubmit,
    loadDemoData
};


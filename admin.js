// admin.js - Enhanced Admin Dashboard with Analytics

// Admin configuration
const ADMIN_CONFIG = {
    adminEmails: ['knsleybusiness@gmail.com'], // ← STEP 4: CHANGE THIS TO YOUR EMAIL
    monthlyGrowthTarget: 15,
    operationalCosts: 2500
};

// Chart instances
let charts = {};

// Initialize admin dashboard
async function initAdminDashboard() {
    console.log('Initializing enhanced admin dashboard...');

    const user = firebase.auth().currentUser;

    if (!user) {
        redirectToLogin();
        return;
    }

    if (!isAdmin(user)) {
        showError('Access denied. Admin privileges required.');
        return;
    }

    document.getElementById('admin-user').textContent = user.email;
    setupEventListeners();
    await loadDashboardData();
    initializeCharts();
}

// Initialize all charts
function initializeCharts() {
    createMarketTrendsChart();
    createCategoryChart();
    createRegionalChart();
    createRevenueChart();
    createUserDemographicsChart();
    createInvestmentChart();
}

// Create Market Trends Chart
function createMarketTrendsChart() {
    const ctx = document.getElementById('marketTrendsChart').getContext('2d');
    charts.marketTrends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Market Value (GHS)',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 35000, 40000, 45000, 50000, 55000, 60000],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Market Value Trends'
                }
            }
        }
    });
}

// Create Category Distribution Chart
function createCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    charts.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Crops', 'Livestock', 'Equipment', 'Processed Foods', 'Logistics'],
            datasets: [{
                data: [40, 25, 15, 12, 8],
                backgroundColor: [
                    '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'
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

// Create Regional Distribution Chart
function createRegionalChart() {
    const ctx = document.getElementById('regionalChart').getContext('2d');
    charts.regional = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Greater Accra', 'Ashanti', 'Western', 'Eastern', 'Central', 'Northern'],
            datasets: [{
                label: 'Market Share (%)',
                data: [35, 25, 15, 10, 8, 7],
                backgroundColor: '#3b82f6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Regional Market Distribution'
                }
            }
        }
    });
}

// Create Revenue Chart
function createRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    charts.revenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
                label: 'Revenue',
                data: [15000, 25000, 35000, 45000],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true
            }, {
                label: 'Expenses',
                data: [8000, 12000, 15000, 18000],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Create User Demographics Chart
function createUserDemographicsChart() {
    const ctx = document.getElementById('userDemographicsChart').getContext('2d');
    charts.userDemographics = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Farmers', 'Buyers', 'Logistics', 'Processors', 'Retailers'],
            datasets: [{
                data: [45, 30, 10, 8, 7],
                backgroundColor: [
                    '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'
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

// Create Investment Chart
function createInvestmentChart() {
    const ctx = document.getElementById('investmentChart').getContext('2d');
    charts.investment = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Valuation (GHS)',
                data: [100000, 250000, 500000, 750000, 1200000],
                backgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Company Valuation Growth'
                }
            }
        }
    });
}

// Load comprehensive dashboard data
async function loadDashboardData() {
    try {
        const [usersSnapshot, productsSnapshot] = await Promise.all([
            firebase.firestore().collection('users').get(),
            firebase.firestore().collection('products').get()
        ]);

        // Calculate metrics
        const totalUsers = usersSnapshot.size;
        const totalProducts = productsSnapshot.size;
        const marketValue = calculateMarketValue(productsSnapshot);
        const monthlyRevenue = calculateMonthlyRevenue();

        // Update statistics
        document.getElementById('total-users').textContent = totalUsers.toLocaleString();
        document.getElementById('total-products').textContent = totalProducts.toLocaleString();
        document.getElementById('market-value').textContent = `GHS ${marketValue.toLocaleString()}`;
        document.getElementById('monthly-revenue').textContent = `GHS ${monthlyRevenue.toLocaleString()}`;

        // Update growth percentages
        document.getElementById('user-growth').textContent = `+${calculateGrowthRate(totalUsers, 100)}% this month`;
        document.getElementById('product-growth').textContent = `+${calculateGrowthRate(totalProducts, 150)}% this month`;
        document.getElementById('value-growth').textContent = `+${calculateGrowthRate(marketValue, 50000)}% this month`;
        document.getElementById('revenue-growth').textContent = `+${calculateGrowthRate(monthlyRevenue, 2000)}% this month`;

        // Update financial metrics
        updateFinancialMetrics(marketValue, monthlyRevenue);
        updateInvestmentMetrics();

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data');
    }
}

// Calculate market value from products
function calculateMarketValue(productsSnapshot) {
    let totalValue = 0;
    productsSnapshot.forEach(doc => {
        const product = doc.data();
        totalValue += (product.price || 0) * (product.quantity || 1);
    });
    return totalValue;
}

// Calculate monthly revenue (simulated)
function calculateMonthlyRevenue() {
    return Math.floor(Math.random() * 10000) + 5000;
}

// Calculate growth rate
function calculateGrowthRate(current, previous) {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
}

// Update financial metrics
function updateFinancialMetrics(marketValue, monthlyRevenue) {
    const operatingCosts = ADMIN_CONFIG.operationalCosts;
    const netProfit = monthlyRevenue - operatingCosts;

    document.getElementById('avg-product-value').textContent = `GHS ${Math.round(marketValue / 1000)}`;
    document.getElementById('transaction-volume').textContent = `${Math.round(monthlyRevenue / 100)}`;
    document.getElementById('total-revenue').textContent = `GHS ${monthlyRevenue.toLocaleString()}`;
    document.getElementById('operating-costs').textContent = `GHS ${operatingCosts.toLocaleString()}`;
    document.getElementById('net-profit').textContent = `GHS ${netProfit.toLocaleString()}`;
}

// Update investment metrics
function updateInvestmentMetrics() {
    document.getElementById('valuation').textContent = `GHS 1,200,000`;
    document.getElementById('growth-rate').textContent = `+18%`;
    document.getElementById('active-users').textContent = `72%`;
    document.getElementById('conversion-rate').textContent = `15%`;
}

// Generate comprehensive reports
async function generateReports() {
    showSuccess('Generating comprehensive reports...');

    setTimeout(() => {
        const reports = {
            financial: 'Financial Report: Strong growth in Q4 2024',
            user: 'User Report: 45% increase in farmer registrations',
            market: 'Market Report: Crop category leading with 40% share'
        };

        showSuccess('Reports generated successfully!');
        console.log('Generated Reports:', reports);
    }, 2000);
}

// Check if user is admin
function isAdmin(user) {
    return ADMIN_CONFIG.adminEmails.includes(user.email);
}

// Redirect to login if not authenticated
function redirectToLogin() {
    alert('Please login to access admin dashboard');
    window.location.href = 'index.html';
}

// Setup event listeners
function setupEventListeners() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Handle logout
async function handleLogout() {
    try {
        await firebase.auth().signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        showError('Logout failed');
    }
}

// Utility functions
function showError(message) {
    alert('Error: ' + message);
}

function showSuccess(message) {
    alert('Success: ' + message);
}

// Initialize admin dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            clearInterval(checkFirebase);
            initAdminDashboard();
        }
    }, 100);

    setTimeout(() => {
        clearInterval(checkFirebase);
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            initAdminDashboard();
        }
    }, 5000);
});

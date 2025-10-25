// Dashboard JavaScript - Personal Finance Tracker
// This file contains all the functionality for the dashboard application

// Global variables
let transactions = [];
let budgets = [];
let goals = [];
let categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];
let currentUser = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    
    // Initialize the dashboard
    initializeDashboard();
    loadData();
    updateUI();
    setupEventListeners();
});

// Initialize dashboard components
function initializeDashboard() {
    // Set user info
    document.getElementById('userName').textContent = currentUser.name || 'User';
    document.getElementById('userEmail').textContent = currentUser.email || 'user@example.com';
    document.getElementById('profileName').value = currentUser.name || '';
    document.getElementById('profileEmail').value = currentUser.email || '';
    
    // Set current date for transaction form
    document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
    
    // Populate category dropdowns
    populateCategoryDropdowns();
    
    // Initialize charts
    initializeCharts();
}

// Load data from localStorage
function loadData() {
    // Load transactions
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    }
    
    // Load budgets
    const savedBudgets = localStorage.getItem('budgets');
    if (savedBudgets) {
        budgets = JSON.parse(savedBudgets);
    }
    
    // Load goals
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
        goals = JSON.parse(savedGoals);
    }
    
    // Load categories
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
        categories = JSON.parse(savedCategories);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('budgets', JSON.stringify(budgets));
    localStorage.setItem('goals', JSON.stringify(goals));
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Setup event listeners
function setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            showView(view);
        });
    });
    
    // Mobile menu toggle
    document.getElementById('mobileMenuToggle').addEventListener('click', toggleSidebar);
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    document.getElementById('mobileOverlay').addEventListener('click', closeSidebar);
    
    // Form submissions
    document.getElementById('transactionForm').addEventListener('submit', handleTransactionSubmit);
    document.getElementById('budgetForm').addEventListener('submit', handleBudgetSubmit);
    document.getElementById('goalForm').addEventListener('submit', handleGoalSubmit);
    document.getElementById('profileForm').addEventListener('submit', handleProfileSubmit);
    
    // Filters
    document.getElementById('typeFilter').addEventListener('change', filterTransactions);
    document.getElementById('categoryFilter').addEventListener('change', filterTransactions);
    document.getElementById('dateFilter').addEventListener('change', filterTransactions);
    
    // Report period change
    document.getElementById('reportPeriod').addEventListener('change', updateCharts);
}

// Navigation functions
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-content').forEach(view => {
        view.classList.add('hidden');
    });
    
    // Show selected view
    document.getElementById(viewName + 'View').classList.remove('hidden');
    
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
    
    // Update page title
    document.getElementById('pageTitle').textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1);
    
    // Update specific views
    if (viewName === 'reports') {
        updateCharts();
    }
    
    // Close mobile sidebar
    closeSidebar();
}

// Sidebar functions
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
    document.getElementById('mobileOverlay').classList.toggle('show');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('show');
    document.getElementById('mobileOverlay').classList.remove('show');
}

// Transaction functions
function openTransactionModal(type) {
    document.getElementById('transactionType').value = type;
    document.getElementById('transactionModalTitle').textContent = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    document.getElementById('transactionModal').classList.add('show');
}

function handleTransactionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const transaction = {
        id: Date.now(),
        type: formData.get('type'),
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        description: formData.get('description'),
        date: formData.get('date'),
        timestamp: new Date().toISOString()
    };
    
    // Add to transactions array
    transactions.unshift(transaction);
    
    // Save data
    saveData();
    
    // Update UI
    updateUI();
    
    // Close modal
    closeModal('transactionModal');
    
    // Reset form
    e.target.reset();
    document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
}

function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveData();
        updateUI();
    }
}

// Budget functions
function openBudgetModal() {
    document.getElementById('budgetModal').classList.add('show');
}

function handleBudgetSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const budget = {
        id: Date.now(),
        category: formData.get('category'),
        amount: parseFloat(formData.get('amount')),
        spent: 0,
        timestamp: new Date().toISOString()
    };
    
    // Check if budget already exists for this category
    const existingBudget = budgets.find(b => b.category === budget.category);
    if (existingBudget) {
        alert('A budget already exists for this category. Please choose a different category.');
        return;
    }
    
    // Add to budgets array
    budgets.push(budget);
    
    // Save data
    saveData();
    
    // Update UI
    updateUI();
    
    // Close modal
    closeModal('budgetModal');
    
    // Reset form
    e.target.reset();
}

function deleteBudget(id) {
    if (confirm('Are you sure you want to delete this budget?')) {
        budgets = budgets.filter(b => b.id !== id);
        saveData();
        updateUI();
    }
}

// Goal functions
function openGoalModal() {
    document.getElementById('goalModal').classList.add('show');
}

function handleGoalSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const goal = {
        id: Date.now(),
        name: formData.get('name'),
        target: parseFloat(formData.get('target')),
        current: parseFloat(formData.get('current')),
        timestamp: new Date().toISOString()
    };
    
    // Add to goals array
    goals.push(goal);
    
    // Save data
    saveData();
    
    // Update UI
    updateUI();
    
    // Close modal
    closeGoalModal();
    
    // Reset form
    e.target.reset();
    document.getElementById('goalCurrent').value = 0;
}

function deleteGoal(id) {
    if (confirm('Are you sure you want to delete this goal?')) {
        goals = goals.filter(g => g.id !== id);
        saveData();
        updateUI();
    }
}

// Category functions
function addCategory() {
    const input = document.getElementById('newCategory');
    const categoryName = input.value.trim();
    
    if (!categoryName) {
        alert('Please enter a category name');
        return;
    }
    
    if (categories.includes(categoryName)) {
        alert('This category already exists');
        return;
    }
    
    categories.push(categoryName);
    saveData();
    populateCategoryDropdowns();
    updateCategoriesList();
    input.value = '';
}

function deleteCategory(categoryName) {
    if (confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
        categories = categories.filter(c => c !== categoryName);
        saveData();
        populateCategoryDropdowns();
        updateCategoriesList();
    }
}

// Profile functions
function handleProfileSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    currentUser.name = formData.get('name');
    currentUser.email = formData.get('email');
    
    localStorage.setItem('user', JSON.stringify(currentUser));
    
    // Update UI
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    
    alert('Profile updated successfully!');
}

// Data management functions
function exportData() {
    const data = {
        transactions,
        budgets,
        goals,
        categories,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'finance-tracker-export.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (confirm('This will replace all your current data. Are you sure?')) {
                        transactions = data.transactions || [];
                        budgets = data.budgets || [];
                        goals = data.goals || [];
                        categories = data.categories || ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];
                        saveData();
                        updateUI();
                        alert('Data imported successfully!');
                    }
                } catch (error) {
                    alert('Error importing data. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function clearAllData() {
    if (confirm('This will permanently delete all your data. Are you sure?')) {
        if (confirm('This action cannot be undone. Are you absolutely sure?')) {
            transactions = [];
            budgets = [];
            goals = [];
            categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];
            saveData();
            updateUI();
            alert('All data has been cleared.');
        }
    }
}

// UI Update functions
function updateUI() {
    updateBalance();
    updateMetrics();
    updateRecentTransactions();
    updateBudgets();
    updateGoals();
    updateTransactionsTable();
    updateCategoriesList();
}

function updateBalance() {
    const balance = transactions.reduce((sum, transaction) => {
        return sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
    }, 0);
    
    document.getElementById('currentBalance').textContent = `$${balance.toFixed(2)}`;
}

function updateMetrics() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });
    
    const income = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const netIncome = income - expenses;
    
    document.getElementById('totalIncome').textContent = `$${income.toFixed(2)}`;
    document.getElementById('totalExpenses').textContent = `$${expenses.toFixed(2)}`;
    document.getElementById('netIncome').textContent = `$${netIncome.toFixed(2)}`;
    
    // Update budget spending
    updateBudgetSpending();
}

function updateBudgetSpending() {
    budgets.forEach(budget => {
        const spent = transactions
            .filter(t => t.type === 'expense' && t.category === budget.category)
            .reduce((sum, t) => sum + t.amount, 0);
        budget.spent = spent;
    });
    saveData();
}

function updateRecentTransactions() {
    const container = document.getElementById('recentTransactionsList');
    const recentTransactions = transactions.slice(0, 5);
    
    if (recentTransactions.length === 0) {
        container.innerHTML = `
            <div class="no-transactions">
                <i class="fas fa-receipt"></i>
                <p>No transactions yet</p>
                <button class="btn btn-primary" onclick="openTransactionModal('expense')">Add Your First Transaction</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentTransactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon ${transaction.type}">
                    <i class="fas fa-${transaction.type === 'income' ? 'arrow-up' : 'arrow-down'}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <p>${transaction.category}</p>
                </div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
                </div>
                <div class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</div>
            </div>
        </div>
    `).join('');
}

function updateBudgets() {
    const container = document.getElementById('budgetCards');
    const budgetsContainer = document.getElementById('budgetsGrid');
    
    if (budgets.length === 0) {
        const noBudgetsHTML = `
            <div class="no-budgets">
                <i class="fas fa-piggy-bank"></i>
                <p>No budgets created yet</p>
                <button class="btn btn-primary" onclick="openBudgetModal()">Create Your First Budget</button>
            </div>
        `;
        container.innerHTML = noBudgetsHTML;
        budgetsContainer.innerHTML = noBudgetsHTML;
        return;
    }
    
    const budgetHTML = budgets.map(budget => {
        const percentage = (budget.spent / budget.amount) * 100;
        const isOverBudget = budget.spent > budget.amount;
        
        return `
            <div class="budget-card">
                <div class="budget-header">
                    <span class="budget-category">${budget.category}</span>
                    <span class="budget-amount">$${budget.spent.toFixed(2)} / $${budget.amount.toFixed(2)}</span>
                </div>
                <div class="budget-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%; background: ${isOverBudget ? '#dc2626' : '#2563eb'};"></div>
                    </div>
                </div>
                <div class="budget-stats">
                    <span>${percentage.toFixed(1)}% used</span>
                    <span>$${(budget.amount - budget.spent).toFixed(2)} remaining</span>
                </div>
                <div class="budget-actions">
                    <button class="btn btn-sm btn-outline" onclick="deleteBudget(${budget.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = budgetHTML;
    budgetsContainer.innerHTML = budgetHTML;
}

function updateGoals() {
    const container = document.getElementById('goalsGrid');
    
    if (goals.length === 0) {
        container.innerHTML = `
            <div class="no-goals">
                <i class="fas fa-bullseye"></i>
                <p>No goals set yet</p>
                <button class="btn btn-primary" onclick="openGoalModal()">Set Your First Goal</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = goals.map(goal => {
        const percentage = (goal.current / goal.target) * 100;
        
        return `
            <div class="goal-card">
                <div class="goal-header">
                    <span class="goal-name">${goal.name}</span>
                    <span class="goal-target">$${goal.current.toFixed(2)} / $${goal.target.toFixed(2)}</span>
                </div>
                <div class="goal-progress">
                    <div class="goal-progress-bar">
                        <div class="goal-progress-fill" style="width: ${Math.min(percentage, 100)}%;"></div>
                    </div>
                </div>
                <div class="goal-stats">
                    <span class="goal-percentage">${percentage.toFixed(1)}% complete</span>
                    <span>$${(goal.target - goal.current).toFixed(2)} remaining</span>
                </div>
                <div class="goal-actions">
                    <button class="btn btn-sm btn-outline" onclick="deleteGoal(${goal.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateTransactionsTable() {
    const tbody = document.getElementById('transactionsTableBody');
    const filteredTransactions = getFilteredTransactions();
    
    if (filteredTransactions.length === 0) {
        tbody.innerHTML = `
            <tr class="no-data">
                <td colspan="6">
                    <div class="no-transactions">
                        <i class="fas fa-receipt"></i>
                        <p>No transactions found</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredTransactions.map(transaction => `
        <tr>
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td>${transaction.description}</td>
            <td>${transaction.category}</td>
            <td><span class="transaction-type ${transaction.type}">${transaction.type}</span></td>
            <td class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
            </td>
            <td>
                <div class="transaction-actions">
                    <button class="btn btn-sm btn-outline" onclick="deleteTransaction(${transaction.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getFilteredTransactions() {
    let filtered = [...transactions];
    
    const typeFilter = document.getElementById('typeFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    if (typeFilter !== 'all') {
        filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    if (dateFilter) {
        filtered = filtered.filter(t => t.date === dateFilter);
    }
    
    return filtered;
}

function filterTransactions() {
    updateTransactionsTable();
}

function updateCategoriesList() {
    const container = document.getElementById('categoriesList');
    
    container.innerHTML = categories.map(category => `
        <div class="category-item">
            <span class="category-name">${category}</span>
            <button class="btn btn-sm btn-danger" onclick="deleteCategory('${category}')">Delete</button>
        </div>
    `).join('');
}

function populateCategoryDropdowns() {
    const dropdowns = [
        'transactionCategory',
        'budgetCategory',
        'categoryFilter'
    ];
    
    dropdowns.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        const currentValue = dropdown.value;
        
        // Clear existing options except the first one
        dropdown.innerHTML = dropdown.querySelector('option:first-child').outerHTML;
        
        // Add category options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            dropdown.appendChild(option);
        });
        
        // Restore previous value if it still exists
        if (categories.includes(currentValue)) {
            dropdown.value = currentValue;
        }
    });
}

// Chart functions
function initializeCharts() {
    // Initialize Chart.js charts
    updateCharts();
}

function updateCharts() {
    updateCategoryChart();
    updateIncomeExpenseChart();
    updateTrendsChart();
}

function updateCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    const categoryData = {};
    transactions.filter(t => t.type === 'expense').forEach(transaction => {
        categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount;
    });
    
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    const colors = [
        '#2563eb', '#059669', '#dc2626', '#7c3aed', '#ea580c',
        '#0891b2', '#be123c', '#65a30d', '#9333ea', '#c2410c'
    ];
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 0
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

function updateIncomeExpenseChart() {
    const ctx = document.getElementById('incomeExpenseChart');
    if (!ctx) return;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });
    
    const income = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [income, expenses],
                backgroundColor: ['#059669', '#dc2626'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateTrendsChart() {
    const ctx = document.getElementById('trendsChart');
    if (!ctx) return;
    
    const months = [];
    const incomeData = [];
    const expenseData = [];
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push(date.toLocaleDateString('en-US', { month: 'short' }));
        
        const monthTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === date.getMonth() && 
                   transactionDate.getFullYear() === date.getFullYear();
        });
        
        const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        incomeData.push(income);
        expenseData.push(expenses);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Income',
                data: incomeData,
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4
            }, {
                label: 'Expenses',
                data: expenseData,
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function closeGoalModal() {
    closeModal('goalModal');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Sample data for demonstration
function addSampleData() {
    if (transactions.length === 0) {
        const sampleTransactions = [
            {
                id: 1,
                type: 'income',
                amount: 5000,
                category: 'Salary',
                description: 'Monthly salary',
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString()
            },
            {
                id: 2,
                type: 'expense',
                amount: 150,
                category: 'Food',
                description: 'Grocery shopping',
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString()
            },
            {
                id: 3,
                type: 'expense',
                amount: 50,
                category: 'Transport',
                description: 'Gas',
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString()
            }
        ];
        
        transactions = sampleTransactions;
        saveData();
        updateUI();
    }
}

// Initialize with sample data if no data exists
if (transactions.length === 0) {
    addSampleData();
}

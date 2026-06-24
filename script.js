// Complete dataset of 9 products
const productsData = {
    shoe1: { id: 'shoe1', name: 'Air Jordan 1 High OG Taxi', price: 28000000, priceText: '28,000,000 T', description: 'High-quality leather / High-cut form / Accurate color details / inspired by the color of a taxi / Wings logo on the wrist / Light and comfortable / For men and women', images: ['images/shoes1.png.jpg', 'images/shoes1(1).png.jpg', 'images/shoes1(2).png.jpg'] },
    shoe2: { id: 'shoe2', name: 'Air Jordan 1 High OG White Cement', price: 14900000, priceText: '14,900,000 T', description: 'Outsole with pivot circle pattern / High-cut form / High-quality leather / Light and comfortable / For men and women', images: ['images/shoes2.png.jpg', 'images/shoes2(1).png.jpg', 'images/shoes2(2).png.jpg'] },
    shoe3: { id: 'shoe3', name: 'Jordan 1 mid Rebellionaire', price: 12900000, priceText: '12,900,000 T', description: 'Air cushioning in the sole / High-quality leather / High-cut form / Light and comfortable / For men and women', images: ['images/shoes3.png.jpg', 'images/shoes3(1).png.jpg', 'images/shoes3(2).png.jpg'] },
    shoe4: { id: 'shoe4', name: 'Air Jordan 1 Travis Scott Black Grey', price: 6750000, priceText: '6,750,000 T', description: 'Synthetic leather / Abrasion resistant / Air circulation capability / Non-washable / For men and women ', images: ['images/shoes4.png.jpg', 'images/shoes4(1).png.jpg', 'images/shoes4(2).png.jpg'] },
    shoe5: { id: 'shoe5', name: 'Air Jordan Travis Scott Black Phantom', price: 8500000, priceText: '8,500,000 T', description: 'Antibacterial and anti-oder / Abrasion resistant / Light and comfortable / Non-washable / For men and women ', images: ['images/shoes5.png.jpg', 'images/shoes5(1).png.jpg', 'images/shoes5(2).png.jpg'] },
    shoe6: { id: 'shoe6', name: 'Air Jordan 1 Travis Scott Cold Planer', price: 12000000, priceText: '12,000,000 T', description: 'Light and comfortable / Abrasion resistant / Non-washable / Synthetic leather and suede / For men and women ', images: ['images/shoes6.png.jpg', 'images/shoes6(1).png.jpg', 'images/shoes6(2).png.jpg'] },
    shoe7: { id: 'shoe7', name: 'Air Force Ambush Phantom White', price: 5200000, priceText: '5,200,000 T', description: 'Waterproof / Antibacterial and anti-oder / Synthetic leather / Light and comfortable / For men and women ', images: ['images/shoes7.png.jpg', 'images/shoes7(1).png.jpg', 'images/shoes7(2).png.jpg'] },
    shoe8: { id: 'shoe8', name: 'Air Force LXX Vandalized', price: 5200000, priceText: '5,200,000 T', description: 'Abrasion resistant / Waterproof and antibacterial  / Street style / Light and comfortable / For men and women ', images: ['images/shoes8.png.jpg', 'images/shoes8(1).png.jpg', 'images/shoes8(2).png.jpg'] },
    shoe9: { id: 'shoe9', name: 'Air Force 1 Undefeated Beige Black', price: 6470000, priceText: '6,470,000 T', description: 'Perfume scent / Light and comfortable / Antibacterial and anti-oder / Synthetic leather / For men and women ', images: ['images/shoes9.png.jpg', 'images/shoes9(1).png.jpg', 'images/shoes9(2).png.jpg'] }
};

const productsList = Object.keys(productsData).map(key => ({
    id: productsData[key].id,
    name: productsData[key].name,
    price: productsData[key].priceText,
    image: productsData[key].images[0]
}));

// Shopping Cart Logic
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }

function addToCart(productId, size, quantity = 1) {
    const product = productsData[productId];
    if (!product) return false;
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    if (existingItem) { existingItem.quantity += quantity; } 
    else { cart.push({ id: productId, name: product.name, price: product.priceText, priceValue: product.price, size: size, quantity: quantity, image: product.images[0] }); }
    saveCart();
    return true;
}

function removeFromCart(index) { cart.splice(index, 1); saveCart(); displayCart(); }

function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) { removeFromCart(index); return; }
    cart[index].quantity = newQuantity; saveCart(); displayCart();
}

function getCartTotal() { return cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0); }

function displayCart() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;
    if (cart.length === 0) { 
        cartContainer.innerHTML = '<div class="empty-cart">🛒 Your cart is empty</div>'; 
        if(document.getElementById('cartTotal')) document.getElementById('cartTotal').innerText = '0'; 
        return; 
    }
    cartContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}"><div class="cart-item-info"><h4>${item.name}</h4><p>Size: ${item.size}</p><p>Price: ${item.price}</p></div>
            <div class="cart-item-actions"><button onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button><span>${item.quantity}</span><button onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
            <button class="remove-btn" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button></div></div>`).join('');
    if(document.getElementById('cartTotal')) document.getElementById('cartTotal').innerText = getCartTotal().toLocaleString();
}

function checkout() {
    if (cart.length === 0) { alert('Your cart is empty!'); return; }
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        const cartPage = document.getElementById('cartPage');
        if(cartPage) cartPage.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';
            checkSession();
            setTimeout(() => {
                showError('registerError', 'Please login or register to complete your purchase.');
            }, 100);
        } else {
            alert('Please login or register to complete your purchase.');
        }
        return;
    }

    // Close cart, open checkout modal
    const cartPage = document.getElementById('cartPage');
    if(cartPage) cartPage.style.display = 'none';

    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        // Reset fields
        document.getElementById('checkoutPhone').value = '';
        document.getElementById('checkoutAddress').value = '';
        document.getElementById('checkoutError').style.display = 'none';

        // Show order summary
        const summary = document.getElementById('checkoutSummary');
        const itemLines = cart.map(item => `<span>${item.name} × ${item.quantity} (Size ${item.size})</span>`).join('');
        summary.innerHTML = `<div class="summary-items">${itemLines}</div><div class="summary-total">Total: <strong>${getCartTotal().toLocaleString()} T</strong></div>`;

        checkoutModal.style.display = 'flex';
    }
}

function isValidIranPhone(phone) {
    // Iranian mobile: starts with 09, exactly 11 digits
    return /^09[0-9]{9}$/.test(phone);
}

function submitOrder() {
    const phone = document.getElementById('checkoutPhone').value.trim();
    const address = document.getElementById('checkoutAddress').value.trim();

    if (!phone || !address) {
        showError('checkoutError', 'Please fill in both phone number and address.');
        return;
    }
    if (!isValidIranPhone(phone)) {
        showError('checkoutError', 'Please enter a valid Iranian mobile number (e.g. 09121234567).');
        return;
    }
    if (address.length < 10) {
        showError('checkoutError', 'Please enter a more complete address.');
        return;
    }

    // Place the order
    alert('✅ Order placed!\nTotal: ' + getCartTotal().toLocaleString() + ' T\n📞 ' + phone + '\n📍 ' + address);
    cart = []; saveCart(); displayCart();

    const checkoutModal = document.getElementById('checkoutModal');
    if(checkoutModal) checkoutModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Product Detail Setup
let currentProductId = null;

// DOM Events Configuration
document.addEventListener('DOMContentLoaded', function() {
    const cartPage = document.getElementById('cartPage');
    const cartIcon = document.getElementById('cartIcon');
    const closeCart = document.getElementById('closeCart');
    
    if (cartIcon) {
        cartIcon.onclick = function() { displayCart(); if(cartPage) cartPage.style.display = 'block'; document.body.style.overflow = 'hidden'; }
    }
    if (closeCart) {
        closeCart.onclick = function() { if(cartPage) cartPage.style.display = 'none'; document.body.style.overflow = 'auto'; }
    }

    const closeCheckout = document.getElementById('closeCheckout');
    if (closeCheckout) {
        closeCheckout.onclick = function() {
            document.getElementById('checkoutModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Initialize session state on page load
    checkSession();
});

// Search Logic
const searchPage = document.getElementById('searchPage');
const searchIcon = document.getElementById('searchIcon');
const closeSearch = document.getElementById('closeSearch');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

if(searchIcon) {
    searchIcon.onclick = function() { if(searchPage) searchPage.style.display = 'block'; if(searchInput) searchInput.focus(); displayResults(productsList); }
}
if(closeSearch) {
    closeSearch.onclick = function() { if(searchPage) searchPage.style.display = 'none'; if(searchInput) searchInput.value = ''; }
}
function displayResults(products) {
    if (!searchResults) return;
    if (products.length === 0) { searchResults.innerHTML = '<div class="no-results">🔍 No product found</div>'; return; }
    searchResults.innerHTML = products.map(product => `<div class="search-item" onclick="window.location.href='product.html?id=${product.id}'"><img src="${product.image}"><div class="search-item-info"><h3>${product.name}</h3></div><div class="search-item-price">${product.price}</div></div>`).join('');
}
if(searchInput) {
    searchInput.addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase().trim();
        if (term === '') { displayResults(productsList); return; }
        displayResults(productsList.filter(p => p.name.toLowerCase().includes(term)));
    });
}

// Keydown Global Listener (Escape to Close Modals)
document.addEventListener('keydown', function(e) { 
    if (e.key === 'Escape' && document.getElementById('checkoutModal') && document.getElementById('checkoutModal').style.display === 'flex') {
        document.getElementById('checkoutModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (e.key === 'Escape' && searchPage && searchPage.style.display === 'block') { 
        if(searchPage) searchPage.style.display = 'none'; 
        if(searchInput) searchInput.value = ''; 
    } 
    if (e.key === 'Escape' && document.getElementById('cartPage') && document.getElementById('cartPage').style.display === 'block') { 
        document.getElementById('cartPage').style.display = 'none'; 
        document.body.style.overflow = 'auto'; 
    } 
    const authModal = document.getElementById('authModal');
    if (e.key === 'Escape' && authModal && authModal.style.display === 'block') {
        authModal.style.display = 'none';
    }
});

// Click Outside Modals to Close
window.onclick = function(event) { 
    const authModal = document.getElementById('authModal');
    if (event.target == authModal) { if(authModal) authModal.style.display = "none"; }
    if (event.target == document.getElementById('cartPage')) { 
        document.getElementById('cartPage').style.display = "none"; 
        document.body.style.overflow = 'auto'; 
    } 
}

/* ==========================================================================
   AUTHENTICATION ENGINE (Registration, Entry, Exit, Session Persistence)
   ========================================================================== */

const authModal = document.getElementById('authModal');
const userIcon = document.getElementById('userIcon');
const closeAuth = document.getElementById('closeAuth');

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const profileView = document.getElementById('profileView');

if(userIcon) {
    userIcon.onclick = function() {
        if(authModal) authModal.style.display = "flex";
        checkSession(); 
    }
}

if(closeAuth) {
    closeAuth.onclick = function() {
        if(authModal) authModal.style.display = "none";
    }
}

// Switch auth layouts inside the modal
function toggleAuth(type) {
    if (type === 'login') {
        if(registerForm) registerForm.style.display = 'none';
        if(loginForm) loginForm.style.display = 'flex';
        clearErrors();
    } else {
        if(loginForm) loginForm.style.display = 'none';
        if(registerForm) registerForm.style.display = 'flex';
        clearErrors();
    }
}

function showError(elementId, message) {
    const errorDiv = document.getElementById(elementId);
    if(errorDiv) {
        errorDiv.innerText = message;
        errorDiv.style.display = 'block';
    }
}

function clearErrors() {
    const regErr = document.getElementById('registerError');
    const logErr = document.getElementById('loginError');
    if(regErr) regErr.style.display = 'none';
    if(logErr) logErr.style.display = 'none';
}

// 1. Account Creation & Validation Mechanics
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function registerUser() {
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');
    
    if(!emailInput || !passwordInput) return;
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        return showError('registerError', 'Please fill in all fields.');
    }
    if (!isValidEmail(email)) {
    return showError('registerError', 'Please enter a valid email address.');
    }
    if (password.length < 6) {
        return showError('registerError', 'Password must be at least 6 characters.');
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Duplicate check validation
    const userExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
        return showError('registerError', 'An account with this email already exists.');
    }

    // Save profile dataset
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login session upon successful registration
    startSession(email);
}

// 2. Authentication Verification Logic
function loginUser() {
    const emailInput = document.getElementById('logEmail');
    const passwordInput = document.getElementById('logPassword');
    
    if(!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        return showError('loginError', 'Please enter your email and password.');
    }

    if (!isValidEmail(email)) {
    return showError('loginError', 'Please enter a valid email address.');
    }
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Match local database profile credentials
    const validUser = users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
    
    if (validUser) {
        startSession(email);
    } else {
        showError('loginError', 'Incorrect email or password.');
    }
}

// 3. Persistent Session Synchronization
function startSession(email) {
    localStorage.setItem('currentUser', email);
    checkSession();
}

function checkSession() {
    const currentUser = localStorage.getItem('currentUser');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const userIconEl = document.getElementById('userIcon');
    
    if (currentUser) {
        // Active session state configuration
        if(registerForm) registerForm.style.display = 'none';
        if(loginForm) loginForm.style.display = 'none';
        if(profileView) profileView.style.display = 'flex';
        if(userEmailDisplay) userEmailDisplay.innerText = currentUser;
        if(userIconEl) userIconEl.style.color = '#28a745'; // Green profile state confirmation indicator
    } else {
        // Terminated/Non-existent session config layout
        if(profileView) profileView.style.display = 'none';
        if(registerForm) registerForm.style.display = 'flex';
        if(loginForm) loginForm.style.display = 'none';
        if(userIconEl) userIconEl.style.color = ''; // Reverts icon color back to normal theme
    }
}

// 4. Session Termination (Logout Handling)
function logoutUser() {
    localStorage.removeItem('currentUser');
    checkSession();
    
    // Clear forms datasets
    if(document.getElementById('logEmail')) document.getElementById('logEmail').value = '';
    if(document.getElementById('logPassword')) document.getElementById('logPassword').value = '';
    if(document.getElementById('regEmail')) document.getElementById('regEmail').value = '';
    if(document.getElementById('regPassword')) document.getElementById('regPassword').value = '';
    
    if(authModal) authModal.style.display = "none";
}
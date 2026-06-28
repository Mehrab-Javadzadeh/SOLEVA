const productsData = {
    shoe1: { id: 'shoe1', name: 'Air Jordan 1 High OG Taxi', price: 28000000, priceText: '28,000,000 T', description: 'High-quality leather / High-cut form / Accurate color details / inspired by the color of a taxi / Wings logo on the wrist / Light and comfortable / For men and women', images: ['images/shoes1.png.jpg', 'images/shoes1(1).png.jpg', 'images/shoes1(2).png.jpg'] },
    shoe2: { id: 'shoe2', name: 'Air Jordan 1 High OG White Cement', price: 14900000, priceText: '14,900,000 T', description: 'Outsole with pivot circle pattern / High-cut form / High-quality leather / Light and comfortable / For men and women', images: ['images/shoes2.png.jpg', 'images/shoes2(1).png.jpg', 'images/shoes2(2).png.jpg'] },
    shoe3: { id: 'shoe3', name: 'Jordan 1 mid Rebellionaire', price: 12900000, priceText: '12,900,000 T', description: 'Air cushioning in the sole / High-quality leather / High-cut form / Light and comfortable / For men and women', images: ['images/shoes3.png.jpg', 'images/shoes3(1).png.jpg', 'images/shoes3(2).png.jpg'] },
    shoe4: { id: 'shoe4', name: 'Air Jordan 1 Travis Scott Black Grey', price: 6750000, priceText: '6,750,000 T', description: 'Synthetic leather / Abrasion resistant / Air circulation capability / Non-washable / For men and women', images: ['images/shoes4.png.jpg', 'images/shoes4(1).png.jpg', 'images/shoes4(2).png.jpg'] },
    shoe5: { id: 'shoe5', name: 'Air Jordan Travis Scott Black Phantom', price: 8500000, priceText: '8,500,000 T', description: 'Antibacterial and anti-oder / Abrasion resistant / Light and comfortable / Non-washable / For men and women', images: ['images/shoes5.png.jpg', 'images/shoes5(1).png.jpg', 'images/shoes5(2).png.jpg'] },
    shoe6: { id: 'shoe6', name: 'Air Jordan 1 Travis Scott Cold Planer', price: 12000000, priceText: '12,000,000 T', description: 'Light and comfortable / Abrasion resistant / Non-washable / Synthetic leather and suede / For men and women', images: ['images/shoes6.png.jpg', 'images/shoes6(1).png.jpg', 'images/shoes6(2).png.jpg'] },
    shoe7: { id: 'shoe7', name: 'Air Force Ambush Phantom White', price: 5200000, priceText: '5,200,000 T', description: 'Waterproof / Antibacterial and anti-oder / Synthetic leather / Light and comfortable / For men and women', images: ['images/shoes7.png.jpg', 'images/shoes7(1).png.jpg', 'images/shoes7(2).png.jpg'] },
    shoe8: { id: 'shoe8', name: 'Air Force LXX Vandalized', price: 5200000, priceText: '5,200,000 T', description: 'Abrasion resistant / Waterproof and antibacterial / Street style / Light and comfortable / For men and women', images: ['images/shoes8.png.jpg', 'images/shoes8(1).png.jpg', 'images/shoes8(2).png.jpg'] },
    shoe9: { id: 'shoe9', name: 'Air Force 1 Undefeated Beige Black', price: 6470000, priceText: '6,470,000 T', description: 'Perfume scent / Light and comfortable / Antibacterial and anti-oder / Synthetic leather / For men and women', images: ['images/shoes9.png.jpg', 'images/shoes9(1).png.jpg', 'images/shoes9(2).png.jpg'] }
};

const productsList = Object.keys(productsData).map(key => ({
    id: productsData[key].id,
    name: productsData[key].name,
    price: productsData[key].priceText,
    image: productsData[key].images[0]
}));

// Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }

function addToCart(productId, size, quantity = 1) {
    const product = productsData[productId];
    if (!product) return false;
    const existing = cart.find(item => item.id === productId && item.size === size);
    if (existing) { existing.quantity += quantity; }
    else { cart.push({ id: productId, name: product.name, price: product.priceText, priceValue: product.price, size, quantity, image: product.images[0] }); }
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
        if (document.getElementById('cartTotal')) document.getElementById('cartTotal').innerText = '0';
        return;
    }
    cartContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Size: ${item.size}</p>
                <p>Price: ${item.price}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                <button class="remove-btn" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
            </div>
        </div>`).join('');
    if (document.getElementById('cartTotal')) document.getElementById('cartTotal').innerText = getCartTotal().toLocaleString();
}

// Checkout
function checkout() {
    if (cart.length === 0) { alert('Your cart is empty!'); return; }
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        const cartPage = document.getElementById('cartPage');
        if (cartPage) cartPage.style.display = 'none';
        document.body.style.overflow = 'auto';
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';
            checkSession();
            setTimeout(() => showError('registerError', 'Please login or register to complete your purchase.'), 100);
        }
        return;
    }
    const cartPage = document.getElementById('cartPage');
    if (cartPage) cartPage.style.display = 'none';
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        document.getElementById('checkoutPhone').value = '';
        document.getElementById('checkoutAddress').value = '';
        document.getElementById('checkoutError').style.display = 'none';
        const itemLines = cart.map(item => `<span>${item.name} × ${item.quantity} (Size ${item.size})</span>`).join('');
        document.getElementById('checkoutSummary').innerHTML = `<div class="summary-items">${itemLines}</div><div class="summary-total">Total: <strong>${getCartTotal().toLocaleString()} T</strong></div>`;
        checkoutModal.style.display = 'flex';
    }
}

function isValidIranPhone(phone) { return /^09[0-9]{9}$/.test(phone); }

function submitOrder() {
    const phone = document.getElementById('checkoutPhone').value.trim();
    const address = document.getElementById('checkoutAddress').value.trim();
    if (!phone || !address) { showError('checkoutError', 'Please fill in both phone number and address.'); return; }
    if (!isValidIranPhone(phone)) { showError('checkoutError', 'Please enter a valid Iranian mobile number (e.g. 09121234567).'); return; }
    if (address.length < 10) { showError('checkoutError', 'Please enter a more complete address.'); return; }
    alert('✅ Order placed!\nTotal: ' + getCartTotal().toLocaleString() + ' T\n📞 ' + phone + '\n📍 ' + address);
    cart = []; saveCart(); displayCart();
    document.getElementById('checkoutModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Auth helpers
function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) { el.innerText = message; el.style.display = 'block'; }
}

function clearErrors() {
    const regErr = document.getElementById('registerError');
    const logErr = document.getElementById('loginError');
    if (regErr) regErr.style.display = 'none';
    if (logErr) logErr.style.display = 'none';
}

function toggleAuth(type) {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    if (type === 'login') {
        if (registerForm) registerForm.style.display = 'none';
        if (loginForm) loginForm.style.display = 'flex';
    } else {
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'flex';
    }
    clearErrors();
}

function checkSession() {
    const currentUser = localStorage.getItem('currentUser');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const profileView = document.getElementById('profileView');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const userIconEl = document.getElementById('userIcon');
    const authModal = document.getElementById('authModal');
    if (currentUser) {
        if (registerForm) registerForm.style.display = 'none';
        if (loginForm) loginForm.style.display = 'none';
        if (profileView) profileView.style.display = 'flex';
        if (userEmailDisplay) userEmailDisplay.innerText = currentUser;
        if (userIconEl) userIconEl.style.color = '#28a745';
    } else {
        if (profileView) profileView.style.display = 'none';
        if (registerForm) registerForm.style.display = 'flex';
        if (loginForm) loginForm.style.display = 'none';
        if (userIconEl) userIconEl.style.color = '';
    }
}

function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function registerUser() {
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');
    if (!emailInput || !passwordInput) return;
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) return showError('registerError', 'Please fill in all fields.');
    if (!isValidEmail(email)) return showError('registerError', 'Please enter a valid email address.');
    if (password.length < 6) return showError('registerError', 'Password must be at least 6 characters.');
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) return showError('registerError', 'An account with this email already exists.');
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    startSession(email);
}

function loginUser() {
    const emailInput = document.getElementById('logEmail');
    const passwordInput = document.getElementById('logPassword');
    if (!emailInput || !passwordInput) return;
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) return showError('loginError', 'Please enter your email and password.');
    if (!isValidEmail(email)) return showError('loginError', 'Please enter a valid email address.');
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const valid = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (valid) startSession(email);
    else showError('loginError', 'Incorrect email or password.');
}

function startSession(email) {
    localStorage.setItem('currentUser', email);
    checkSession();
    const authModal = document.getElementById('authModal');
    if (authModal) authModal.style.display = 'none';
    updateMenuUserStatus();
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    checkSession();
    if (document.getElementById('logEmail')) document.getElementById('logEmail').value = '';
    if (document.getElementById('logPassword')) document.getElementById('logPassword').value = '';
    if (document.getElementById('regEmail')) document.getElementById('regEmail').value = '';
    if (document.getElementById('regPassword')) document.getElementById('regPassword').value = '';
    const authModal = document.getElementById('authModal');
    if (authModal) authModal.style.display = 'none';
    updateMenuUserStatus();
}

// DOM Events — all wired up after DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    const cartPage = document.getElementById('cartPage');
    const cartIcon = document.getElementById('cartIcon');
    const closeCart = document.getElementById('closeCart');
    const closeCheckout = document.getElementById('closeCheckout');
    const authModal = document.getElementById('authModal');
    const userIcon = document.getElementById('userIcon');
    const closeAuth = document.getElementById('closeAuth');
    const searchPage = document.getElementById('searchPage');
    const searchIcon = document.getElementById('searchIcon');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (cartIcon) cartIcon.onclick = function () { displayCart(); if (cartPage) cartPage.style.display = 'block'; document.body.style.overflow = 'hidden'; };
    if (closeCart) closeCart.onclick = function () { if (cartPage) cartPage.style.display = 'none'; document.body.style.overflow = 'auto'; };
    if (closeCheckout) closeCheckout.onclick = function () { document.getElementById('checkoutModal').style.display = 'none'; document.body.style.overflow = 'auto'; };
    if (userIcon) userIcon.onclick = function () { if (authModal) authModal.style.display = 'flex'; checkSession(); };
    if (closeAuth) closeAuth.onclick = function () { if (authModal) authModal.style.display = 'none'; };

    if (searchIcon) searchIcon.onclick = function () { if (searchPage) searchPage.style.display = 'block'; if (searchInput) searchInput.focus(); displayResults(searchResults, productsList); };
    if (closeSearch) closeSearch.onclick = function () { if (searchPage) searchPage.style.display = 'none'; if (searchInput) searchInput.value = ''; };
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            displayResults(searchResults, query ? productsList.filter(p => p.name.toLowerCase().includes(query)) : productsList);
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (searchPage && searchPage.style.display === 'block') { searchPage.style.display = 'none'; if (searchInput) searchInput.value = ''; }
            if (authModal && authModal.style.display === 'flex') authModal.style.display = 'none';
            const checkoutModal = document.getElementById('checkoutModal');
            if (checkoutModal && checkoutModal.style.display === 'flex') { checkoutModal.style.display = 'none'; document.body.style.overflow = 'auto'; }
        }
    });

    window.onclick = function (event) {
        if (event.target == authModal) authModal.style.display = 'none';
        if (event.target == cartPage) { cartPage.style.display = 'none'; document.body.style.overflow = 'auto'; }
    };

    checkSession();
});

function displayResults(container, products) {
    if (!container) return;
    if (products.length === 0) { container.innerHTML = '<div class="no-results">No results found</div>'; return; }
    container.innerHTML = products.map(p => `
        <div class="search-item" onclick="window.location.href='product.html?id=${p.id}'">
            <img src="${p.image}" alt="${p.name}">
            <div class="search-item-info">
                <h3>${p.name}</h3>
                <div class="search-item-price">${p.price}</div>
            </div>
        </div>`).join('');
}

// Toggle password visibility
document.addEventListener('DOMContentLoaded', function() {
    // Register password toggle
    const toggleRegPass = document.getElementById('toggleRegPassword');
    const regPassInput = document.getElementById('regPassword');
    if (toggleRegPass && regPassInput) {
        toggleRegPass.addEventListener('click', function() {
            if (regPassInput.type === 'password') {
                regPassInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                regPassInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    }

    // Login password toggle
    const toggleLogPass = document.getElementById('toggleLogPassword');
    const logPassInput = document.getElementById('logPassword');
    if (toggleLogPass && logPassInput) {
        toggleLogPass.addEventListener('click', function() {
            if (logPassInput.type === 'password') {
                logPassInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                logPassInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    }
});

// Side Menu Functions
function openMenu() {
    var menu = document.getElementById('sideMenu');
    var overlay = document.getElementById('menuOverlay');
    if (menu) {
        menu.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (typeof updateMenuUserStatus === 'function') {
            updateMenuUserStatus();
        }
    }
    if (overlay) overlay.classList.add('show');
}

function closeMenu() {
    var menu = document.getElementById('sideMenu');
    var overlay = document.getElementById('menuOverlay');
    if (menu) {
        menu.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
    if (overlay) overlay.classList.remove('show');
}

function updateMenuUserStatus() {
    var currentUser = localStorage.getItem('currentUser');
    var userName = document.getElementById('menuUserName');
    var userEmail = document.getElementById('menuUserEmail');
    var userIcon = document.getElementById('menuUserIcon');
    var authText = document.getElementById('menuAuthText');
    var logoutBtn = document.getElementById('menuLogoutBtn');
    var authAction = document.getElementById('menuAuthAction');

    if (currentUser) {
        if (userName) userName.textContent = 'Welcome!';
        if (userEmail) userEmail.textContent = currentUser;
        if (userIcon) userIcon.classList.add('logged-in');
        if (authText) authText.textContent = 'My Account';
        if (logoutBtn) logoutBtn.style.display = 'flex';
        if (authAction) authAction.href = '#';
    } else {
        if (userName) userName.textContent = 'Guest';
        if (userEmail) userEmail.textContent = 'Not logged in';
        if (userIcon) userIcon.classList.remove('logged-in');
        if (authText) authText.textContent = 'Login / Register';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (authAction) authAction.href = '#';
    }
}

function openAuthFromMenu() {
    var currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        var authModal = document.getElementById('authModal');
        if (authModal) {
            closeMenu();
            setTimeout(function() {
                authModal.style.display = 'flex';
                checkSession();
            }, 300);
        }
        return;
    }
    closeMenu();
    setTimeout(function() {
        var authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.style.display = 'flex';
            checkSession();
        }
    }, 300);
}

function logoutFromMenu() {
    if (confirm('Are you sure you want to logout?')) {
        logoutUser();
        closeMenu();
        setTimeout(updateMenuUserStatus, 100);
        var userIconEl = document.getElementById('userIcon');
        if (userIconEl) userIconEl.style.color = '';
    }
}

// Open cart from menu (My Orders)
function openCartFromMenu() {
    closeMenu();
    setTimeout(function() {
        var cartPage = document.getElementById('cartPage');
        if (cartPage) {
            displayCart();
            cartPage.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }, 300);
}

// Menu toggle event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Side Menu
    var menuIcon = document.getElementById('menuIcon');
    var closeMenuBtn = document.getElementById('closeMenu');

    // Create overlay if it doesn't exist
    if (!document.getElementById('menuOverlay')) {
        var overlay = document.createElement('div');
        overlay.id = 'menuOverlay';
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', closeMenu);
    }

    // Remove any existing click listeners by cloning
    if (menuIcon) {
        var newMenuIcon = menuIcon.cloneNode(true);
        menuIcon.parentNode.replaceChild(newMenuIcon, menuIcon);
        
        newMenuIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openMenu();
        });
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }

    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            var menu = document.getElementById('sideMenu');
            if (menu && menu.classList.contains('open')) {
                closeMenu();
            }
        }
    });

    // Update menu status when auth modal closes
    var authModal = document.getElementById('authModal');
    if (authModal) {
        var observer = new MutationObserver(function() {
            if (authModal.style.display === 'none' || authModal.style.display === '') {
                updateMenuUserStatus();
            }
        });
        observer.observe(authModal, { attributes: true, attributeFilter: ['style'] });
    }

    // Initial update 
    updateMenuUserStatus();
});
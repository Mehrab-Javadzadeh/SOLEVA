// ============================================================
// products
// ============================================================

var productsData = {
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

var productsList = Object.keys(productsData).map(function(key) {
    return {
        id: productsData[key].id,
        name: productsData[key].name,
        price: productsData[key].priceText,
        image: productsData[key].images[0]
    };
});


// ============================================================
// cart
// ============================================================

var cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, size, quantity) {
    quantity = quantity || 1;
    var product = productsData[productId];
    if (!product) return false;

    var existing = cart.find(function(item) {
        return item.id === productId && item.size === size;
    });

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.priceText,
            priceValue: product.price,
            size: size,
            quantity: quantity,
            image: product.images[0]
        });
    }

    saveCart();
    return true;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    displayCart();
}

function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }
    cart[index].quantity = newQuantity;
    saveCart();
    displayCart();
}

function getCartTotal() {
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total += cart[i].priceValue * cart[i].quantity;
    }
    return total;
}

function displayCart() {
    var container = document.getElementById('cartItems');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">🛒 Your cart is empty</div>';
        if (document.getElementById('cartTotal')) document.getElementById('cartTotal').innerText = '0';
        return;
    }

    var html = '';
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        html +=
            '<div class="cart-item">' +
                '<img src="' + item.image + '">' +
                '<div class="cart-item-info">' +
                    '<h4>' + item.name + '</h4>' +
                    '<p>Size: ' + item.size + '</p>' +
                    '<p>Price: ' + item.price + '</p>' +
                '</div>' +
                '<div class="cart-item-actions">' +
                    '<button onclick="updateQuantity(' + i + ', ' + (item.quantity - 1) + ')">-</button>' +
                    '<span>' + item.quantity + '</span>' +
                    '<button onclick="updateQuantity(' + i + ', ' + (item.quantity + 1) + ')">+</button>' +
                    '<button class="remove-btn" onclick="removeFromCart(' + i + ')"><i class="fas fa-trash"></i></button>' +
                '</div>' +
            '</div>';
    }

    container.innerHTML = html;
    if (document.getElementById('cartTotal')) {
        document.getElementById('cartTotal').innerText = getCartTotal().toLocaleString();
    }
}


// ============================================================
// checkout
// ============================================================

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    var currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        var cartPage = document.getElementById('cartPage');
        if (cartPage) cartPage.style.display = 'none';
        document.body.style.overflow = 'auto';

        var modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';
            checkSession();
            setTimeout(function() {
                showError('registerError', 'Please login or register to complete your purchase.');
            }, 100);
        }
        return;
    }

    var cartPage = document.getElementById('cartPage');
    if (cartPage) cartPage.style.display = 'none';

    var checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        document.getElementById('checkoutPhone').value = '';
        document.getElementById('checkoutAddress').value = '';
        document.getElementById('checkoutError').style.display = 'none';

        var itemLines = '';
        for (var i = 0; i < cart.length; i++) {
            itemLines += '<span>' + cart[i].name + ' × ' + cart[i].quantity + ' (Size ' + cart[i].size + ')</span>';
        }

        document.getElementById('checkoutSummary').innerHTML =
            '<div class="summary-items">' + itemLines + '</div>' +
            '<div class="summary-total">Total: <strong>' + getCartTotal().toLocaleString() + ' T</strong></div>';

        checkoutModal.style.display = 'flex';
    }
}

function isValidIranPhone(phone) {
    return /^09[0-9]{9}$/.test(phone);
}

function submitOrder() {
    var phone = document.getElementById('checkoutPhone').value.trim();
    var address = document.getElementById('checkoutAddress').value.trim();

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

    alert('✅ Order placed!\nTotal: ' + getCartTotal().toLocaleString() + ' T\n📞 ' + phone + '\n📍 ' + address);

    cart = [];
    saveCart();
    displayCart();
    document.getElementById('checkoutModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}


// ============================================================
// auth helpers
// ============================================================

function showError(elementId, message) {
    var el = document.getElementById(elementId);
    if (el) {
        el.innerText = message;
        el.style.display = 'block';
    }
}

function clearErrors() {
    var regErr = document.getElementById('registerError');
    var logErr = document.getElementById('loginError');
    if (regErr) regErr.style.display = 'none';
    if (logErr) logErr.style.display = 'none';
}

function toggleAuth(type) {
    var registerForm = document.getElementById('registerForm');
    var loginForm = document.getElementById('loginForm');

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
    var currentUser = localStorage.getItem('currentUser');
    var registerForm = document.getElementById('registerForm');
    var loginForm = document.getElementById('loginForm');
    var profileView = document.getElementById('profileView');
    var userEmailDisplay = document.getElementById('userEmailDisplay');
    var userIconEl = document.getElementById('userIcon');

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

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function registerUser() {
    var emailInput = document.getElementById('regEmail');
    var passwordInput = document.getElementById('regPassword');
    if (!emailInput || !passwordInput) return;

    var email = emailInput.value.trim();
    var password = passwordInput.value;

    if (!email || !password) {
        showError('registerError', 'Please fill in all fields.');
        return;
    }

    if (!isValidEmail(email)) {
        showError('registerError', 'Please enter a valid email address.');
        return;
    }

    if (password.length < 6) {
        showError('registerError', 'Password must be at least 6 characters.');
        return;
    }

    var users = JSON.parse(localStorage.getItem('users')) || [];

    for (var i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === email.toLowerCase()) {
            showError('registerError', 'An account with this email already exists.');
            return;
        }
    }

    users.push({ email: email, password: password });
    localStorage.setItem('users', JSON.stringify(users));
    startSession(email);
}

function loginUser() {
    var emailInput = document.getElementById('logEmail');
    var passwordInput = document.getElementById('logPassword');
    if (!emailInput || !passwordInput) return;

    var email = emailInput.value.trim();
    var password = passwordInput.value;

    if (!email || !password) {
        showError('loginError', 'Please enter your email and password.');
        return;
    }

    if (!isValidEmail(email)) {
        showError('loginError', 'Please enter a valid email address.');
        return;
    }

    var users = JSON.parse(localStorage.getItem('users')) || [];
    var valid = null;

    for (var i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === email.toLowerCase() && users[i].password === password) {
            valid = users[i];
            break;
        }
    }

    if (valid) {
        startSession(email);
    } else {
        showError('loginError', 'Incorrect email or password.');
    }
}

function startSession(email) {
    localStorage.setItem('currentUser', email);
    checkSession();
    var authModal = document.getElementById('authModal');
    if (authModal) authModal.style.display = 'none';
    updateMenuUserStatus();
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    checkSession();

    var logEmail = document.getElementById('logEmail');
    var logPassword = document.getElementById('logPassword');
    var regEmail = document.getElementById('regEmail');
    var regPassword = document.getElementById('regPassword');

    if (logEmail) logEmail.value = '';
    if (logPassword) logPassword.value = '';
    if (regEmail) regEmail.value = '';
    if (regPassword) regPassword.value = '';

    var authModal = document.getElementById('authModal');
    if (authModal) authModal.style.display = 'none';
    updateMenuUserStatus();
}


// ============================================================
// dom events
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    var cartPage = document.getElementById('cartPage');
    var cartIcon = document.getElementById('cartIcon');
    var closeCart = document.getElementById('closeCart');
    var closeCheckout = document.getElementById('closeCheckout');
    var authModal = document.getElementById('authModal');
    var userIcon = document.getElementById('userIcon');
    var closeAuth = document.getElementById('closeAuth');
    var searchPage = document.getElementById('searchPage');
    var searchIcon = document.getElementById('searchIcon');
    var closeSearch = document.getElementById('closeSearch');
    var searchInput = document.getElementById('searchInput');
    var searchResults = document.getElementById('searchResults');

    // cart
    if (cartIcon) {
        cartIcon.onclick = function() {
            displayCart();
            if (cartPage) cartPage.style.display = 'block';
            document.body.style.overflow = 'hidden';
        };
    }

    if (closeCart) {
        closeCart.onclick = function() {
            if (cartPage) cartPage.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }

    if (closeCheckout) {
        closeCheckout.onclick = function() {
            document.getElementById('checkoutModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }

    // auth
    if (userIcon) {
        userIcon.onclick = function() {
            if (authModal) authModal.style.display = 'flex';
            checkSession();
        };
    }

    if (closeAuth) {
        closeAuth.onclick = function() {
            if (authModal) authModal.style.display = 'none';
        };
    }

    // search
    if (searchIcon) {
        searchIcon.onclick = function() {
            if (searchPage) searchPage.style.display = 'block';
            if (searchInput) searchInput.focus();
            displayResults(searchResults, productsList);
        };
    }

    if (closeSearch) {
        closeSearch.onclick = function() {
            if (searchPage) searchPage.style.display = 'none';
            if (searchInput) searchInput.value = '';
        };
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            var query = this.value.toLowerCase().trim();
            var filtered = query ? productsList.filter(function(p) {
                return p.name.toLowerCase().includes(query);
            }) : productsList;
            displayResults(searchResults, filtered);
        });
    }

    // escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (searchPage && searchPage.style.display === 'block') {
                searchPage.style.display = 'none';
                if (searchInput) searchInput.value = '';
            }
            if (authModal && authModal.style.display === 'flex') {
                authModal.style.display = 'none';
            }
            var checkoutModal = document.getElementById('checkoutModal');
            if (checkoutModal && checkoutModal.style.display === 'flex') {
                checkoutModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });

    // click outside
    window.onclick = function(event) {
        if (event.target == authModal) authModal.style.display = 'none';
        if (event.target == cartPage) {
            cartPage.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    checkSession();
    loadTheme();
});

function displayResults(container, products) {
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<div class="no-results">No results found</div>';
        return;
    }

    var html = '';
    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        html +=
            '<div class="search-item" onclick="window.location.href=\'product.html?id=' + p.id + '\'">' +
                '<img src="' + p.image + '" alt="' + p.name + '">' +
                '<div class="search-item-info">' +
                    '<h3>' + p.name + '</h3>' +
                    '<div class="search-item-price">' + p.price + '</div>' +
                '</div>' +
            '</div>';
    }

    container.innerHTML = html;
}


// ============================================================
// password toggle
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    var toggleRegPass = document.getElementById('toggleRegPassword');
    var regPassInput = document.getElementById('regPassword');

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

    var toggleLogPass = document.getElementById('toggleLogPassword');
    var logPassInput = document.getElementById('logPassword');

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


// ============================================================
// side menu
// ============================================================

function openMenu() {
    var menu = document.getElementById('sideMenu');
    var overlay = document.getElementById('menuOverlay');

    if (menu) {
        menu.classList.add('open');
        document.body.style.overflow = 'hidden';
        updateMenuUserStatus();
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

document.addEventListener('DOMContentLoaded', function() {
    var menuIcon = document.getElementById('menuIcon');
    var closeMenuBtn = document.getElementById('closeMenu');

    if (!document.getElementById('menuOverlay')) {
        var overlay = document.createElement('div');
        overlay.id = 'menuOverlay';
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', closeMenu);
    }

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

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            var menu = document.getElementById('sideMenu');
            if (menu && menu.classList.contains('open')) {
                closeMenu();
            }
        }
    });

    var authModal = document.getElementById('authModal');
    if (authModal) {
        var observer = new MutationObserver(function() {
            if (authModal.style.display === 'none' || authModal.style.display === '') {
                updateMenuUserStatus();
            }
        });
        observer.observe(authModal, { attributes: true, attributeFilter: ['style'] });
    }

    updateMenuUserStatus();
});


// ============================================================
// dark / light mode toggle
// ============================================================

function toggleTheme() {
    var body = document.body;
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var logo = document.getElementById('themeToggle');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', toggleTheme);
    }
});
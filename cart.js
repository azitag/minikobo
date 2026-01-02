// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');

    // Open cart sidebar (even if empty)
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('open');
            if (cartOverlay) cartOverlay.classList.add('active');
        });
    }

    // Close cart sidebar
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('open');
            if (cartOverlay) cartOverlay.classList.remove('active');
        });
    }

    // Close cart when clicking overlay
    if (cartOverlay && cartSidebar) {
        cartOverlay.addEventListener('click', function() {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('active');
        });
    }

    // Update cart display
    updateCartDisplay();
    
    // Save cart on window unload
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('minikoboCart', JSON.stringify(cart));
    });
});

// Cart data
let cart = JSON.parse(localStorage.getItem('minikoboCart')) || [];

// Add to cart function
function addToCart(productId, option = 'single', customPrice = null) {
    // Try to find product in fetchedProducts first, then fallback to local products
    let product;
    if (typeof fetchedProducts !== 'undefined' && fetchedProducts.length > 0) {
        product = fetchedProducts.find(p => p.id === productId);
    }
    if (!product && typeof products !== 'undefined') {
        product = products.find(p => p.id === productId);
    }
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const cartItemId = `${productId}-${option}`;
    const existingItem = cart.find(item => item.cartItemId === cartItemId);
    
    // Determine price to use
    let price;
    if (customPrice !== null) {
        price = parseFloat(customPrice);
    } else if (option === 'twin' && product.twin_price) {
        price = parseFloat(product.twin_price);
    } else {
        price = parseFloat(product.price);
    }
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            cartItemId: cartItemId,
            name: product.name,
            price: price,
            quantity: 1,
            option: option,
            image_url: product.image_url || null
        });
    }

    localStorage.setItem('minikoboCart', JSON.stringify(cart));
    updateCartDisplay();
    const optionText = option === 'twin' ? 'Twin Set' : 'Single';
    showNotification(`${product.name} (${optionText}) added to cart!`);
}

// Remove from cart
function removeFromCart(cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    localStorage.setItem('minikoboCart', JSON.stringify(cart));
    updateCartDisplay();
}

// Update quantity
function updateQuantity(cartItemId, change) {
    const item = cart.find(item => item.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(cartItemId);
    } else {
        localStorage.setItem('minikoboCart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');

    if (!cartItems) return;

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    // Display cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-msg">Your cart is empty</p>';
        if (cartTotal) cartTotal.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                ${item.option ? `<p class="cart-item-option">${item.option === 'twin' ? 'Twin Set' : 'Single'}</p>` : ''}
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity('${item.cartItemId}', -1)">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.cartItemId}', 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart('${item.cartItemId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Clear cart
function clearCart() {
    cart = [];
    localStorage.setItem('minikoboCart', JSON.stringify(cart));
    updateCartDisplay();
}

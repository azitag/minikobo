// Checkout functionality for Minikobo
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('minikoboCart')) || [];
    
    // Update cart count
    updateCartCount();
    
    // Display order summary
    displayOrderSummary(cart);
    
    // Handle form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm()) {
                processOrder(cart);
            }
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
});

// Display order summary
function displayOrderSummary(cart) {
    const orderItems = document.getElementById('orderItems');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const orderTotalEl = document.getElementById('orderTotal');
    
    if (!orderItems) return;
    
    // Clear previous items
    orderItems.innerHTML = '';
    
    if (cart.length === 0) {
        orderItems.innerHTML = '<p>Your cart is empty</p>';
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        if (shippingEl) shippingEl.textContent = '$0.00';
        if (taxEl) taxEl.textContent = '$0.00';
        if (orderTotalEl) orderTotalEl.textContent = '$0.00';
        return;
    }
    
    // Calculate totals
    let subtotal = 0;
    
    // Add each item to summary
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-summary-item';
        orderItem.innerHTML = `
            <div>
                <span>${item.name} × ${item.quantity}</span>
            </div>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        
        orderItems.appendChild(orderItem);
    });
    
    // Calculate shipping
    let shipping = 5.00;
    if (subtotal >= 50) {
        shipping = 0.00;
    }
    
    // Calculate tax (8%)
    const tax = subtotal * 0.08;
    
    // Calculate total
    const total = subtotal + shipping + tax;
    
    // Update display
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (orderTotalEl) orderTotalEl.textContent = `$${total.toFixed(2)}`;
}

// Validate form
function validateForm() {
    const requiredFields = [
        'fullName', 'email', 'address', 'city', 'state', 'zipCode', 'country',
        'cardName', 'cardNumber', 'expiry', 'cvv'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'red';
            } else {
                field.style.borderColor = '';
            }
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('email');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            isValid = false;
            emailField.style.borderColor = 'red';
            alert('Please enter a valid email address.');
        }
    }
    
    // Validate card number (simple check for demo)
    const cardNumberField = document.getElementById('cardNumber');
    if (cardNumberField && cardNumberField.value) {
        const cardNumber = cardNumberField.value.replace(/\s/g, '');
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            isValid = false;
            cardNumberField.style.borderColor = 'red';
            alert('Please enter a valid card number (13-19 digits).');
        }
    }
    
    return isValid;
}

// Process order
function processOrder(cart) {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Get form data
    const orderData = {
        customer: {
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            country: document.getElementById('country').value
        },
        payment: {
            cardName: document.getElementById('cardName').value,
            cardLastFour: document.getElementById('cardNumber').value.slice(-4)
        },
        order: cart,
        orderDate: new Date().toISOString(),
        orderId: 'MK' + Date.now().toString().slice(-8)
    };
    
    // Save order to localStorage (for demo purposes)
    const orders = JSON.parse(localStorage.getItem('minikoboOrders')) || [];
    orders.push(orderData);
    localStorage.setItem('minikoboOrders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('minikoboCart');
    
    // Redirect to success page
    window.location.href = 'success.html';
}

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('minikoboCart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}
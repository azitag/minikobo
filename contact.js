// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart functionality
    updateCartCount();
    
    // Cart toggle functionality
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('open');
            if (cartOverlay) cartOverlay.classList.add('active');
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('open');
            if (cartOverlay) cartOverlay.classList.remove('active');
        });
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', function() {
            cartSidebar.classList.remove('open');
            this.classList.remove('active');
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-container')) {
                navLinks.classList.remove('active');
            }
        });
    }
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };
            
            // Validate form
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!validateEmail(formData.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission (in production, this would go to a server)
            console.log('Form submitted:', formData);
            
            // Show success message
            showSuccessModal();
            
            // Reset form
            contactForm.reset();
            
            // Save to localStorage for demo purposes
            saveContactMessage(formData);
        });
    }
    
    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', function() {
            successModal.classList.remove('active');
        });
        
        // Close modal when clicking outside
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }
    
    // Form validation helpers
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('active');
            
            // Auto-close after 5 seconds
            setTimeout(() => {
                modal.classList.remove('active');
            }, 5000);
        }
    }
    
    function saveContactMessage(formData) {
        // Get existing messages or create new array
        const messages = JSON.parse(localStorage.getItem('minikoboContactMessages')) || [];
        
        // Add new message
        messages.push({
            ...formData,
            id: Date.now(),
            read: false
        });
        
        // Save back to localStorage
        localStorage.setItem('minikoboContactMessages', JSON.stringify(messages));
        
        console.log('Message saved to localStorage. Total messages:', messages.length);
    }
    
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'error' ? '#ff4444' : 'var(--primary-color)'};
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: var(--shadow);
            z-index: 2000;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 3s forwards;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3300);
    }
});

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('minikoboCart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Newsletter Subscription
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Newsletter Form Submission
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterModal = document.createElement('div');
    
    // Create newsletter success modal
    newsletterModal.className = 'newsletter-modal';
    newsletterModal.id = 'newsletterModal';
    newsletterModal.innerHTML = `
        <div class="newsletter-modal-content">
            <div class="newsletter-modal-icon">
                <i class="fas fa-envelope-open-text"></i>
            </div>
            <h2>Welcome to the Minikobo Family! 🎨</h2>
            <p>Thank you for subscribing to our newsletter! You'll receive:<br>
            • Updates on new polymer clay creations<br>
            • Exclusive offers and discounts<br>
            • Crafting tips and tutorials<br>
            • Behind-the-scenes studio peeks</p>
            <p><strong>Your first email is on its way!</strong></p>
            <button class="newsletter-modal-btn" id="closeNewsletterModal">
                Continue Exploring
            </button>
        </div>
    `;
    
    document.body.appendChild(newsletterModal);
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const checkbox = this.querySelector('input[type="checkbox"]');
            const email = emailInput.value.trim();
            
            // Validation
            if (!email) {
                showNotification('Please enter your email address.', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            if (!checkbox.checked) {
                showNotification('Please agree to receive updates.', 'error');
                return;
            }
            
            // Save subscription (in production, this would go to a server)
            saveNewsletterSubscription(email);
            
            // Show success modal
            showNewsletterSuccess();
            
            // Reset form
            newsletterForm.reset();
        });
    }
    
    // Close newsletter modal
    const closeNewsletterModal = document.getElementById('closeNewsletterModal');
    if (closeNewsletterModal) {
        closeNewsletterModal.addEventListener('click', function() {
            newsletterModal.classList.remove('active');
        });
    }
    
    newsletterModal.addEventListener('click', function(e) {
        if (e.target === newsletterModal) {
            newsletterModal.classList.remove('active');
        }
    });
    
    // Newsletter functions
    function saveNewsletterSubscription(email) {
        // Get existing subscriptions or create new array
        const subscriptions = JSON.parse(localStorage.getItem('minikoboNewsletterSubs')) || [];
        
        // Check if email already exists
        if (subscriptions.some(sub => sub.email === email)) {
            console.log('Email already subscribed:', email);
            return;
        }
        
        // Add new subscription
        subscriptions.push({
            email: email,
            date: new Date().toISOString(),
            active: true
        });
        
        // Save to localStorage
        localStorage.setItem('minikoboNewsletterSubs', JSON.stringify(subscriptions));
        
        console.log('Newsletter subscription saved:', email);
        console.log('Total subscriptions:', subscriptions.length);
        
        // In a real application, you would send this to your backend
        // Example: sendToBackend({ email: email, source: 'contact-page' });
    }
    
    function showNewsletterSuccess() {
        const modal = document.getElementById('newsletterModal');
        if (modal) {
            modal.classList.add('active');
            
            // Auto-close after 8 seconds
            setTimeout(() => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                }
            }, 8000);
        }
    }
    
    // ... existing validation functions ...
});
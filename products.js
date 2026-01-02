// Supabase configuration
const SUPABASE_URL = 'https://uckvlqshgdqbbrtdrizi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVja3ZscXNoZ2RxYmJydGRyaXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MzkwNTgsImV4cCI6MjA4MjAxNTA1OH0.AhnTN4TOMjKE04DTrIyxZ0w3HRCh_b207-owLG6uSJA';

// Fetch products from Supabase
async function fetchProducts(category = 'all') {
    try {
        let url = `${SUPABASE_URL}/rest/v1/products?select=*`;
        
        if (category && category !== 'all') {
            url += `&category=eq.${encodeURIComponent(category)}`;
        }
        
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Supabase error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched products from Supabase:', data.length);
        return data;
    } catch (error) {
        console.error('Error fetching from Supabase:', error);
        console.log('Falling back to local products');
        // Fallback to local products
        return null;
    }
}

// Fallback to local PHP API
async function fetchFromLocalAPI(category) {
    try {
        let url = 'api/supabase-products.php';
        if (category && category !== 'all') {
            url += `?category=${category}`;
        }
        
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching from local API:', error);
        return getLocalProducts();
    }
}

// Reviews data (stored in localStorage)
let reviewsData = JSON.parse(localStorage.getItem('minikoboReviews')) || {};

// Category information
const categoryInfo = {
    jewelry: {
        icon: "fas fa-gem",
        color: "#ff6b8b",
        name: "Jewelry"
    },
    keychains: {
        icon: "fas fa-key",
        color: "#7b68ee",
        name: "Keychains"
    },
    decor: {
        icon: "fas fa-home",
        color: "#20b2aa",
        name: "Home Decor"
    },
    miniatures: {
        icon: "fas fa-search",
        color: "#ffa500",
        name: "Miniatures"
    }
};

// Display all products
// Global variable to store fetched products
let fetchedProducts = [];

// Display all products
async function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    // Show loading state
    productsGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-light);">Loading products...</p>';
    
    try {
        // Fetch products from Supabase
        const supabaseProducts = await fetchProducts();
        
        // Use fetched products if available, otherwise fall back to local products
        fetchedProducts = (supabaseProducts && supabaseProducts.length > 0) ? supabaseProducts : products;
        
        productsGrid.innerHTML = '';
        
        fetchedProducts.forEach(product => {
            const category = categoryInfo[product.category];
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;
            
            // Handle image or icon display
            const imageHtml = product.image_url 
                ? `<img src="${product.image_url}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">`
                : `<i class="${category ? category.icon : 'fas fa-box'}"></i>`;
            
            productCard.innerHTML = `
                <div class="product-img">
                    ${imageHtml}
                </div>
                <div class="product-info">
                    <span class="product-category" style="background-color: ${category ? category.color : '#888'}20; color: ${category ? category.color : '#888'};">
                        ${category ? category.name : product.category}
                    </span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-footer">
                        <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error displaying products:', error);
        productsGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-light);">Error loading products. Please refresh the page.</p>';
    }
}

// Display reviews for a product
function displayReviews(productId) {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    const reviews = reviewsData[productId] || [];
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review this product!</p>';
        return;
    }
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="review-author">
                    <i class="fas fa-user-circle"></i>
                    <span>${review.name}</span>
                </div>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
            </div>
            <p class="review-text">${review.text}</p>
            ${review.photos && review.photos.length > 0 ? `
                <div class="review-photos">
                    ${review.photos.map(photo => `<img src="${photo}" alt="Review photo">`).join('')}
                </div>
            ` : ''}
            <div class="review-date">${review.date}</div>
        </div>
    `).join('');
}

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Add review
function addReview(productId, reviewData) {
    if (!reviewsData[productId]) {
        reviewsData[productId] = [];
    }
    
    reviewsData[productId].unshift(reviewData);
    localStorage.setItem('minikoboReviews', JSON.stringify(reviewsData));
    displayReviews(productId);
}

// Open product modal
function openProductModal(productId) {
    // Use fetchedProducts if available, otherwise use local products
    const productsToSearch = fetchedProducts.length > 0 ? fetchedProducts : products;
    const product = productsToSearch.find(p => p.id === productId);
    if (!product) return;
    
    const category = categoryInfo[product.category];
    const modal = document.getElementById('productModal');
    
    // Handle image or icon for modal
    const modalIcon = document.getElementById('modalCategoryIcon');
    if (product.image_url) {
        // If product has an image, replace the icon container with an image
        const mainImage = modalIcon.closest('.main-image');
        if (mainImage) {
            mainImage.innerHTML = `<img src="${product.image_url}" alt="${product.name}" class="product-modal-image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">`;
        }
    } else {
        // Use category icon
        modalIcon.className = category ? category.icon : 'fas fa-box';
    }
    
    // Update modal content
    document.getElementById('modalCategory').innerHTML = `
        <span style="background-color: ${category ? category.color : '#888'}20; color: ${category ? category.color : '#888'}; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
            ${category ? category.name : product.category}
        </span>
    `;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalPrice').textContent = `$${parseFloat(product.price).toFixed(2)}`;
    document.getElementById('modalDescription').textContent = product.full_description || product.fullDescription || product.description || '';
    document.getElementById('modalDimensions').textContent = product.dimensions || 'Varies by item';
    document.getElementById('modalColors').textContent = product.colors || 'Multiple colors available';
    
    // Update add to cart button
    const addToCartBtn = document.getElementById('modalAddToCart');
    addToCartBtn.dataset.id = product.id;
    
    // Handle option buttons (Single/Twin)
    const optionButtons = document.querySelectorAll('.option-btn');
    const modalPrice = document.getElementById('modalPrice');
    let selectedOption = 'single'; // default
    let currentPrice = parseFloat(product.price);
    
    optionButtons.forEach(btn => {
        btn.onclick = function() {
            optionButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedOption = this.dataset.option;
            
            // Update price based on selection
            if (selectedOption === 'twin' && product.twin_price) {
                currentPrice = parseFloat(product.twin_price);
                modalPrice.textContent = `$${currentPrice.toFixed(2)}`;
            } else {
                currentPrice = parseFloat(product.price);
                modalPrice.textContent = `$${currentPrice.toFixed(2)}`;
            }
            
            // Update image based on selection
            const modalImage = document.querySelector('.product-modal-image');
            if (modalImage && product.image_url) {
                const baseImagePath = product.image_url.replace('single', '');
                if (selectedOption === 'twin') {
                    modalImage.src = baseImagePath.replace('images/', 'images/twin');
                } else {
                    modalImage.src = baseImagePath.replace('images/', 'images/single');
                }
            }
        };
    });
    
    // Quantity controls
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    minusBtn.onclick = function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    };
    
    plusBtn.onclick = function() {
        let value = parseInt(quantityInput.value);
        if (value < 10) {
            quantityInput.value = value + 1;
        }
    };
    
    // Add to cart from modal
    addToCartBtn.onclick = function() {
        const quantity = parseInt(quantityInput.value);
        const optionText = selectedOption === 'twin' ? 'Twin Set' : 'Single';
        for (let i = 0; i < quantity; i++) {
            addToCart(product.id, selectedOption, currentPrice);
        }
        closeProductModal();
        showNotification(`${quantity} × ${product.name} (${optionText}) added to cart!`);
    };
    
    // Display reviews
    displayReviews(productId);
    
    // Handle review form
    const reviewForm = document.getElementById('reviewForm');
    const photoInput = document.getElementById('reviewPhotos');
    const photoPreview = document.getElementById('photoPreview');
    const photoUploadLabel = document.querySelector('.photo-upload-label');
    
    // Reset form
    if (reviewForm) {
        reviewForm.reset();
        photoPreview.innerHTML = '';
    }
    
    // Photo upload handling
    let selectedPhotos = [];
    
    if (photoUploadLabel) {
        photoUploadLabel.onclick = function() {
            photoInput.click();
        };
    }
    
    if (photoInput) {
        photoInput.onchange = function(e) {
            const files = Array.from(e.target.files);
            selectedPhotos = [];
            photoPreview.innerHTML = '';
            
            files.forEach((file, index) => {
                if (index < 3) { // Limit to 3 photos
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        selectedPhotos.push(event.target.result);
                        const img = document.createElement('div');
                        img.className = 'preview-image';
                        img.innerHTML = `
                            <img src="${event.target.result}" alt="Preview">
                            <button type="button" class="remove-photo" data-index="${selectedPhotos.length - 1}">&times;</button>
                        `;
                        photoPreview.appendChild(img);
                        
                        // Remove photo handler
                        img.querySelector('.remove-photo').onclick = function() {
                            const idx = parseInt(this.dataset.index);
                            selectedPhotos.splice(idx, 1);
                            img.remove();
                        };
                    };
                    reader.readAsDataURL(file);
                }
            });
        };
    }
    
    // Star rating interaction
    const starInputs = document.querySelectorAll('.star-rating input');
    const starLabels = document.querySelectorAll('.star-rating label');
    
    starLabels.forEach((label, index) => {
        label.addEventListener('mouseenter', function() {
            highlightStars(5 - index);
        });
    });
    
    document.querySelector('.star-rating').addEventListener('mouseleave', function() {
        const checked = document.querySelector('.star-rating input:checked');
        if (checked) {
            highlightStars(parseInt(checked.value));
        } else {
            highlightStars(0);
        }
    });
    
    starInputs.forEach(input => {
        input.addEventListener('change', function() {
            highlightStars(parseInt(this.value));
        });
    });
    
    function highlightStars(count) {
        starLabels.forEach((label, index) => {
            if (5 - index <= count) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    }
    
    // Review form submission
    if (reviewForm) {
        reviewForm.onsubmit = function(e) {
            e.preventDefault();
            
            const rating = document.querySelector('.star-rating input:checked');
            if (!rating) {
                alert('Please select a rating');
                return;
            }
            
            const name = document.getElementById('reviewerName').value;
            const text = document.getElementById('reviewText').value;
            
            const reviewData = {
                name: name,
                rating: parseInt(rating.value),
                text: text,
                photos: selectedPhotos,
                date: new Date().toLocaleDateString()
            };
            
            addReview(productId, reviewData);
            
            // Reset form
            reviewForm.reset();
            photoPreview.innerHTML = '';
            selectedPhotos = [];
            highlightStars(0);
            
            showNotification('Thank you for your review! 🌟');
        };
    }
    
    // Open modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('productsGrid')) {
        displayProducts();
        
        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreProducts');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // Event delegation for product cards
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.addEventListener('click', function(e) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productId = parseInt(productCard.dataset.id);
                openProductModal(productId);
            }
        });
    }
    
    // Modal close buttons - set up regardless of productsGrid
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeProductModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeProductModal();
            }
        });
    }
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('productModal');
            if (modal && modal.classList.contains('active')) {
                closeProductModal();
            }
        }
    });
});
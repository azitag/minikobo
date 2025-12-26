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
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching from Supabase:', error);
        // Fallback to local API
        return fetchFromLocalAPI(category);
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

// Product data for Minikobo
const products = [
    {
        id: 1,
        name: "Floral Clay Earrings",
        description: "Handmade polymer clay earrings with delicate floral patterns.",
        fullDescription: "These beautiful floral earrings are crafted from high-quality polymer clay and feature intricate floral designs. Each earring is carefully sculpted by hand, ensuring no two are exactly alike.",
        price: 24.99,
        category: "jewelry",
        dimensions: "2.5 x 1.5 cm",
        colors: "Pink, Lavender, Yellow, Blue",
        featured: true
    },
    {
        id: 2,
        name: "Cactus Keychain",
        description: "Adorable mini cactus keychain with tiny flowers.",
        fullDescription: "This charming cactus keychain will brighten up your keyring! Each cactus is hand-sculpted with realistic details and features tiny polymer clay flowers.",
        price: 16.50,
        category: "keychains",
        dimensions: "4 x 3 cm",
        colors: "Green, Blue, Rainbow",
        featured: true
    },
    {
        id: 3,
        name: "Rainbow Coasters Set",
        description: "Set of 4 colorful polymer clay coasters.",
        fullDescription: "Protect your surfaces in style with these vibrant rainbow coasters! Each set includes four unique coasters with different rainbow gradient patterns.",
        price: 32.00,
        category: "decor",
        dimensions: "10 cm diameter",
        colors: "Rainbow Gradient",
        featured: true
    },
    {
        id: 4,
        name: "Animal Charms Collection",
        description: "Set of 5 miniature animal charms for bracelets.",
        fullDescription: "Create your own unique jewelry with this adorable animal charm collection! Each charm is meticulously sculpted and features incredible details.",
        price: 28.75,
        category: "jewelry",
        dimensions: "1.5-2 cm each",
        colors: "Natural, Pastel, Vibrant",
        featured: true
    },
    {
        id: 5,
        name: "Geometric Trinket Dish",
        description: "Small dish for jewelry with modern geometric design.",
        fullDescription: "Keep your small treasures organized with this stylish geometric trinket dish! The modern geometric pattern is created by layering different colors of polymer clay.",
        price: 22.00,
        category: "decor",
        dimensions: "8 x 8 x 2 cm",
        colors: "Blue, Pink, Earth Tones",
        featured: true
    },
    {
        id: 6,
        name: "Fruit Slice Keychains",
        description: "Set of 3 fruit slice keychains.",
        fullDescription: "Carry a slice of summer with you year-round! This set includes three realistic fruit slice keychains: lemon, orange, and watermelon.",
        price: 20.00,
        category: "keychains",
        dimensions: "3 x 3 cm each",
        colors: "Lemon, Orange, Watermelon",
        featured: true
    },
    {
        id: 7,
        name: "Miniature Food Charms",
        description: "Tiny polymer clay food items for charm bracelets.",
        fullDescription: "These incredibly detailed miniature food charms are almost good enough to eat! The set includes donut, pizza, ice cream, and burger.",
        price: 18.50,
        category: "miniatures",
        dimensions: "1-1.5 cm each",
        colors: "Food Colors",
        featured: true
    },
    {
        id: 8,
        name: "Marble Effect Beads",
        description: "Set of polymer clay beads with elegant marble effect.",
        fullDescription: "Create stunning jewelry with these elegant marble effect beads! Each bead features a unique marble pattern created by swirling together different colors.",
        price: 26.00,
        category: "jewelry",
        dimensions: "0.5-2 cm diameter",
        colors: "White, Black, Rose Gold, Blue",
        featured: true
    },
    {
        id: 9,
        name: "Whale Tail Necklace",
        description: "Delicate whale tail pendant on a silver chain.",
        fullDescription: "This delicate whale tail necklace is both beautiful and meaningful. The whale tail symbolizes protection, good luck, and connection to the ocean.",
        price: 34.99,
        category: "jewelry",
        dimensions: "2 cm pendant",
        colors: "Ocean Blue, Pearl White, Navy",
        featured: true
    },
    {
        id: 10,
        name: "Mushroom Magnets Set",
        description: "Set of 6 cute mushroom magnets for your fridge.",
        fullDescription: "Add a touch of whimsy to your kitchen with these adorable mushroom magnets! This set includes six unique mushrooms with different color patterns.",
        price: 25.00,
        category: "decor",
        dimensions: "3-4 cm tall",
        colors: "Various mushroom colors",
        featured: true
    },
    {
        id: 11,
        name: "Planet Keychains",
        description: "Solar system planets as keychains.",
        fullDescription: "Explore the solar system every time you grab your keys! This set includes five detailed planet keychains based on NASA imagery.",
        price: 30.00,
        category: "keychains",
        dimensions: "2.5-3 cm diameter",
        colors: "Planet colors",
        featured: true
    },
    {
        id: 12,
        name: "Tiny Terrarium",
        description: "Miniature polymer clay terrarium with succulents.",
        fullDescription: "Bring the beauty of a terrarium to your space without any maintenance! This tiny terrarium features realistic polymer clay succulents.",
        price: 38.50,
        category: "miniatures",
        dimensions: "8 x 8 x 12 cm",
        colors: "Green succulents",
        featured: true
    }
];

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
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const category = categoryInfo[product.category];
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        
        productCard.innerHTML = `
            <div class="product-img">
                <i class="${category.icon}"></i>
            </div>
            <div class="product-info">
                <span class="product-category" style="background-color: ${category.color}20; color: ${category.color};">
                    ${category.name}
                </span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart" data-id="${product.id}" title="Add to cart">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
        
        // Add click event to open modal
        productCard.addEventListener('click', function(e) {
            if (!e.target.closest('.add-to-cart')) {
                openProductModal(product.id);
            }
        });
    });
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
}

// Open product modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const category = categoryInfo[product.category];
    const modal = document.getElementById('productModal');
    
    // Update modal content
    document.getElementById('modalCategoryIcon').className = category.icon;
    document.getElementById('modalCategory').innerHTML = `
        <span style="background-color: ${category.color}20; color: ${category.color}; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
            ${category.name}
        </span>
    `;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modalDescription').textContent = product.fullDescription;
    document.getElementById('modalDimensions').textContent = product.dimensions;
    document.getElementById('modalColors').textContent = product.colors;
    
    // Update add to cart button
    const addToCartBtn = document.getElementById('modalAddToCart');
    addToCartBtn.dataset.id = product.id;
    
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
        for (let i = 0; i < quantity; i++) {
            addToCart(product.id);
        }
        closeProductModal();
        showNotification(`${quantity} × ${product.name} added to cart!`);
    };
    
    // Open modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Initialize when page loads
if (document.getElementById('productsGrid')) {
    displayProducts();
    
    // Modal close buttons
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeProductModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeProductModal);
    }
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProductModal();
        }
    });
    
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreProducts');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    }
}
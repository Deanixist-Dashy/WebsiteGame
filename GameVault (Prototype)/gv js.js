// GameVault Application Class
class GameVaultApp {
    constructor() {
        this.cart = [];
        this.wishlist = [];
        this.currentUser = null;
        this.initElements();
        this.initEventListeners();
        this.loadGames();
        this.loadOffers();
    }

    initElements() {
        // Buttons
        this.installBtn = document.getElementById('install-app');
        this.loginBtn = document.getElementById('login-btn');
        this.browseBtn = document.getElementById('browse-btn');
        this.searchBtn = document.getElementById('search-btn');
        this.searchInput = document.getElementById('search-input');
        this.loginSubmit = document.getElementById('login-submit');
        
        // Modals
        this.loginModal = document.getElementById('login-modal');
        this.closeModal = document.getElementById('close-modal');
        
        // Notification
        this.notification = document.getElementById('notification');
        this.notificationMessage = document.getElementById('notification-message');
        
        // Game containers
        this.gameCarousel = document.getElementById('gameCarousel');
        this.offersGrid = document.getElementById('offersGrid');
        
        // Categories
        this.categoryCards = document.querySelectorAll('.category-card');
    }

    initEventListeners() {
        // Button click handlers
        this.installBtn.addEventListener('click', () => this.handleInstall());
        this.loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginModal();
        });
        this.browseBtn.addEventListener('click', () => this.handleBrowse());
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        this.loginSubmit.addEventListener('click', () => this.handleLogin());
        this.closeModal.addEventListener('click', () => this.hideLoginModal());
        
        // Window click handler for modal
        window.addEventListener('click', (e) => {
            if (e.target === this.loginModal) {
                this.hideLoginModal();
            }
        });
        
        // Category card handlers
        this.categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.handleCategorySelect(category);
            });
        });
        
        // Delegated event listeners for dynamic content
        document.addEventListener('click', (e) => {
            // Wishlist button
            if (e.target.classList.contains('wishlist-btn') || e.target.closest('.wishlist-btn')) {
                const btn = e.target.classList.contains('wishlist-btn') ? e.target : e.target.closest('.wishlist-btn');
                const gameId = parseInt(btn.dataset.id);
                this.handleWishlist(gameId);
            }
            
            // Cart button
            if (e.target.classList.contains('cart-btn') || e.target.closest('.cart-btn')) {
                const btn = e.target.classList.contains('cart-btn') ? e.target : e.target.closest('.cart-btn');
                const gameId = parseInt(btn.dataset.id);
                this.handleAddToCart(gameId);
            }
            
            // Offer button
            if (e.target.classList.contains('offer-btn') || e.target.closest('.offer-btn')) {
                const btn = e.target.classList.contains('offer-btn') ? e.target : e.target.closest('.offer-btn');
                const code = btn.dataset.code;
                this.handleOfferCode(code);
            }
        });
    }

    // Game data
    gameData = [
        {
            id: 1,
            title: "Cyberpunk 2077",
            image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
            price: 59.99,
            discountPrice: 39.99,
            vaultExclusive: true,
            category: "action"
        },
        {
            id: 2,
            title: "Elden Ring",
            image: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
            price: 59.99,
            discountPrice: 49.99,
            vaultExclusive: false,
            category: "rpg"
        },
        {
            id: 3,
            title: "Stardew Valley",
            image: "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg",
            price: 14.99,
            discountPrice: null,
            vaultExclusive: true,
            category: "rpg"
        },
        {
            id: 4,
            title: "Apex Legends",
            image: "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg",
            price: 0,
            discountPrice: null,
            vaultExclusive: false,
            category: "action"
        },
        {
            id: 5,
            title: "Baldur's Gate 3",
            image: "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg",
            price: 59.99,
            discountPrice: null,
            vaultExclusive: true,
            category: "rpg"
        },
        {
            id: 6,
            title: "Hades",
            image: "https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg",
            price: 24.99,
            discountPrice: 19.99,
            vaultExclusive: false,
            category: "action"
        }
    ];

    offerData = [
        {
            title: "Vault Sale",
            discount: "Up to 75% off",
            image: "https://via.placeholder.com/586x192/2a3f5a/8a6bdb?text=Vault+Sale",
            code: "VAULT75"
        },
        {
            title: "Weekend Deal",
            discount: "50% off selected titles",
            image: "https://via.placeholder.com/586x192/2a3f5a/8a6bdb?text=Weekend+Deal",
            code: "WEEKEND50"
        },
        {
            title: "New in Vault",
            discount: "Discover the latest games",
            image: "https://via.placeholder.com/586x192/2a3f5a/8a6bdb?text=New+Releases",
            code: "NEWVAULT"
        }
    ];

    loadGames() {
        this.gameCarousel.innerHTML = '';
        
        this.gameData.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.dataset.id = game.id;
            gameCard.dataset.category = game.category;
            
            let exclusiveBadge = '';
            if (game.vaultExclusive) {
                exclusiveBadge = '<span class="exclusive-badge">Vault Exclusive</span>';
            }

            let priceDisplay = game.discountPrice 
                ? `<span style="text-decoration: line-through; color: #b6b6b6; margin-right: 5px;">$${game.price.toFixed(2)}</span> $${game.discountPrice.toFixed(2)}`
                : `$${game.price.toFixed(2)}`;
            
            // Check if game is in wishlist
            const inWishlist = this.wishlist.includes(game.id);
            const wishlistText = inWishlist ? 'In Wishlist' : 'Add to Wishlist';
            const wishlistClass = inWishlist ? 'wishlist-btn active' : 'wishlist-btn';
            
            gameCard.innerHTML = `
                <img src="${game.image}" alt="${game.title}">
                ${exclusiveBadge}
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-price">${priceDisplay}</p>
                    <div class="game-actions">
                        <button class="${wishlistClass}" data-id="${game.id}">
                            <i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i> ${wishlistText}
                        </button>
                        <button class="cart-btn" data-id="${game.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
            this.gameCarousel.appendChild(gameCard);
        });
    }

    loadOffers() {
        this.offersGrid.innerHTML = '';
        
        this.offerData.forEach(offer => {
            const offerCard = document.createElement('div');
            offerCard.className = 'offer-card';
            offerCard.innerHTML = `
                <img src="${offer.image}" alt="${offer.title}">
                <div class="offer-info">
                    <h3>${offer.title}</h3>
                    <p>${offer.discount}</p>
                    <button class="offer-btn" data-code="${offer.code}">Get Deal</button>
                </div>
            `;
            this.offersGrid.appendChild(offerCard);
        });
    }

    // Button handlers
    handleInstall() {
        this.showNotification('Starting GameVault download...');
        
        // Simulate download progress
        setTimeout(() => {
            this.showNotification('Downloading: 25% complete');
        }, 500);
        
        setTimeout(() => {
            this.showNotification('Downloading: 50% complete');
        }, 1000);
        
        setTimeout(() => {
            this.showNotification('Downloading: 75% complete');
        }, 1500);
        
        setTimeout(() => {
            this.showNotification('Download complete! Installer ready to run');
        }, 2000);
    }

    handleBrowse() {
        this.showNotification('Loading your game collection...');
        
        // Smooth scroll to featured section
        setTimeout(() => {
            document.querySelector('.featured').scrollIntoView({
                behavior: 'smooth'
            });
        }, 500);
    }

    handleSearch() {
        const query = this.searchInput.value.trim();
        if (query === '') {
            this.showNotification('Please enter a search term', 'error');
            return;
        }
        
        this.showNotification(`Searching for: "${query}"`);
        
        // In a real app, you would filter games here
        // For demo, we'll just highlight matching games
        const games = document.querySelectorAll('.game-card');
        games.forEach(game => {
            const title = game.querySelector('.game-title').textContent.toLowerCase();
            if (title.includes(query.toLowerCase())) {
                game.style.boxShadow = '0 0 0 2px #6e3bdb';
                setTimeout(() => {
                    game.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 300);
            } else {
                game.style.boxShadow = 'none';
            }
        });
    }

    handleCategorySelect(category) {
        this.showNotification(`Filtering ${category} games...`);
        
        // Highlight the selected category
        this.categoryCards.forEach(card => {
            if (card.dataset.category === category) {
                card.style.transform = 'scale(1.05)';
                card.style.boxShadow = '0 0 0 2px #6e3bdb';
            } else {
                card.style.transform = '';
                card.style.boxShadow = '';
            }
        });
        
        // Filter games (in a real app, this would filter the actual list)
        const games = document.querySelectorAll('.game-card');
        games.forEach(game => {
            if (game.dataset.category === category) {
                game.style.display = 'block';
                setTimeout(() => {
                    game.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 300);
            } else {
                game.style.display = 'none';
            }
        });
        
        // Reset filter after 3 seconds for demo purposes
        setTimeout(() => {
            games.forEach(game => game.style.display = 'block');
            this.categoryCards.forEach(card => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        }, 3000);
    }

    handleWishlist(gameId) {
        const game = this.gameData.find(g => g.id === gameId);
        if (!game) return;
        
        const index = this.wishlist.indexOf(gameId);
        if (index === -1) {
            // Add to wishlist
            this.wishlist.push(gameId);
            this.showNotification(`${game.title} added to your wishlist!`);
        } else {
            // Remove from wishlist
            this.wishlist.splice(index, 1);
            this.showNotification(`${game.title} removed from your wishlist`);
        }
        
        // Reload games to update wishlist status
        this.loadGames();
    }

    handleAddToCart(gameId) {
        const game = this.gameData.find(g => g.id === gameId);
        if (!game) return;
        
        this.cart.push(game);
        this.showNotification(`${game.title} added to your cart!`);
    }

    handleOfferCode(code) {
        this.showNotification(`Discount code copied to clipboard: ${code}`);
        
        // Copy to clipboard
        navigator.clipboard.writeText(code).then(() => {
            console.log('Discount code copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy code: ', err);
        });
    }

    // User authentication
    showLoginModal() {
        this.loginModal.style.display = 'flex';
    }

    hideLoginModal() {
        this.loginModal.style.display = 'none';
    }

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Simulate login
        this.showNotification('Logging in...');
        
        setTimeout(() => {
            this.currentUser = {
                email: email,
                name: email.split('@')[0]
            };
            
            this.loginBtn.textContent = 'My Account';
            this.showNotification(`Welcome back, ${this.currentUser.name}!`);
            this.hideLoginModal();
            
            // Clear form
            document.getElementById('login-email').value = '';
            document.getElementById('login-password').value = '';
        }, 1500);
    }

    // Notification system
    showNotification(message, type = 'success') {
        this.notificationMessage.textContent = message;
        this.notification.className = 'notification';
        
        // Set color based on type
        if (type === 'error') {
            this.notification.classList.add('error');
        } else if (type === 'warning') {
            this.notification.classList.add('warning');
        } else {
            this.notification.classList.remove('error', 'warning');
        }
        
        // Show notification
        setTimeout(() => {
            this.notification.classList.add('show');
        }, 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new GameVaultApp();
});
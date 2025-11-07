// navigation.js - Enhanced Navigation System for Dinhata Buzzer Hub

class NavigationManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    // Get current page name
    getCurrentPage() {
        const path = window.location.pathname;
        return path.split('/').pop() || 'index.html';
    }

    // Initialize navigation
    init() {
        this.setupActiveLinks();
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupNavigationEvents();
    }

    // Setup active navigation links
    setupActiveLinks() {
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            
            // Reset styles
            link.classList.remove('active');
            link.style.color = '';
            link.style.fontWeight = '';
            
            // Set active state
            if (linkPage === this.currentPage || 
                (this.currentPage === '' && linkPage === 'index.html') ||
                (this.currentPage === 'index.html' && linkPage === 'index.html')) {
                
                link.classList.add('active');
                link.style.color = '#2874f0';
                link.style.fontWeight = '600';
            }
        });
    }

    // Setup mobile navigation
    setupMobileNavigation() {
        // Create mobile menu button
        this.createMobileMenu();
        
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    // Create mobile menu
    createMobileMenu() {
        const header = document.querySelector('header');
        if (!header) return;

        // Check if mobile menu already exists
        if (document.getElementById('mobileMenuBtn')) return;

        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.id = 'mobileMenuBtn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
        `;

        const nav = document.querySelector('nav');
        if (nav) {
            nav.parentNode.insertBefore(mobileMenuBtn, nav);
        }

        // Add mobile menu styles
        this.addMobileMenuStyles();

        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
    }

    // Add mobile menu styles
    addMobileMenuStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                #mobileMenuBtn {
                    display: block !important;
                }
                
                nav {
                    position: fixed;
                    top: 70px;
                    left: -100%;
                    width: 80%;
                    height: calc(100vh - 70px);
                    background: white;
                    transition: left 0.3s ease;
                    z-index: 1001;
                    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
                    padding: 20px;
                }
                
                nav.active {
                    left: 0;
                }
                
                .nav-links {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .nav-links a {
                    padding: 12px 15px;
                    border-radius: 8px;
                    border: 1px solid #f0f0f0;
                }
                
                .nav-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 1000;
                    display: none;
                }
                
                .nav-overlay.active {
                    display: block;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const nav = document.querySelector('nav');
        const overlay = document.querySelector('.nav-overlay') || this.createOverlay();
        
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }

    // Create overlay for mobile menu
    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', this.toggleMobileMenu.bind(this));
        return overlay;
    }

    // Handle window resize
    handleResize() {
        const nav = document.querySelector('nav');
        const overlay = document.querySelector('.nav-overlay');
        
        if (window.innerWidth > 768) {
            nav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Setup smooth scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Setup navigation events
    setupNavigationEvents() {
        // Add click event to logo for home navigation
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        // Add search functionality
        this.setupSearch();
        
        // Add cart navigation
        this.setupCartNavigation();
    }

    // Setup search functionality
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.querySelector('.search-bar button');
        
        if (searchInput && searchButton) {
            // Search on button click
            searchButton.addEventListener('click', () => {
                this.performSearch(searchInput.value);
            });
            
            // Search on Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });
            
            // Real-time search suggestions (optional)
            searchInput.addEventListener('input', this.debounce((e) => {
                this.showSearchSuggestions(e.target.value);
            }, 300));
        }
    }

    // Perform search
    performSearch(query) {
        if (query.trim()) {
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
    }

    // Show search suggestions
    showSearchSuggestions(query) {
        // This would typically fetch from an API
        // For now, we'll just log it
        if (query.length > 2) {
            console.log('Search suggestions for:', query);
        }
    }

    // Setup cart navigation
    setupCartNavigation() {
        const cartItems = document.querySelectorAll('.action-item[onclick*="cart.html"]');
        cartItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'cart.html';
            });
        });
    }

    // Debounce function for search
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Navigate to page
    navigateTo(page) {
        window.location.href = page;
    }

    // Navigate back
    goBack() {
        window.history.back();
    }

    // Navigate forward
    goForward() {
        window.history.forward();
    }

    // Refresh current page
    refresh() {
        window.location.reload();
    }

    // Get navigation history
    getHistory() {
        return {
            current: window.location.href,
            previous: document.referrer,
            length: window.history.length
        };
    }

    // Add breadcrumb navigation
    setupBreadcrumbs() {
        const breadcrumbContainer = document.createElement('div');
        breadcrumbContainer.className = 'breadcrumbs';
        breadcrumbContainer.style.cssText = `
            padding: 10px 5%;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            font-size: 14px;
        `;

        const path = window.location.pathname;
        const pages = path.split('/').filter(p => p);
        
        let breadcrumbHTML = '<a href="index.html">Home</a>';
        
        pages.forEach((page, index) => {
            if (page !== 'index.html') {
                const pageName = page.replace('.html', '').replace(/-/g, ' ');
                const isLast = index === pages.length - 1;
                
                breadcrumbHTML += ` <span style="margin: 0 8px; color: #6c757d;">/</span> `;
                
                if (isLast) {
                    breadcrumbHTML += `<span style="color: #2874f0; text-transform: capitalize;">${pageName}</span>`;
                } else {
                    breadcrumbHTML += `<a href="${page}" style="text-transform: capitalize;">${pageName}</a>`;
                }
            }
        });

        breadcrumbContainer.innerHTML = breadcrumbHTML;
        
        // Insert breadcrumbs after header
        const header = document.querySelector('header');
        if (header) {
            header.parentNode.insertBefore(breadcrumbContainer, header.nextSibling);
        }
    }

    // Update cart count in navigation
    updateCartCount(count) {
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }

    // Show navigation loading state
    showLoading() {
        const loader = document.createElement('div');
        loader.id = 'navLoader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, #2874f0, #fb641b);
            z-index: 10000;
            animation: loading 1.5s infinite;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes loading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(loader);

        // Remove loader after 2 seconds
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 2000);
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.navigationManager = new NavigationManager();
    
    // Setup breadcrumbs on appropriate pages
    const currentPage = window.navigationManager.getCurrentPage();
    if (currentPage !== 'index.html') {
        window.navigationManager.setupBreadcrumbs();
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}

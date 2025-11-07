// Dinhata Buzzer Hub - Main JavaScript File
console.log("✅ Dinhata Buzzer Hub JavaScript Loaded");

// Telegram Configuration
const TELEGRAM_CONFIG = {
    BOT_TOKEN: "8589527391:AAEF3bCeKx0J-y9dc0KHeJCOolzHLJjYVo4",
    CHAT_ID: "7681046220",
    ENABLED: true
};

// ✅ -------- TELEGRAM SERVICE --------
async function sendToTelegram(orderData) {
    if (!TELEGRAM_CONFIG.ENABLED) {
        console.log('Telegram notifications are disabled');
        return true;
    }

    const message = formatOrderMessage(orderData);
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            console.log('✅ Order notification sent to Telegram');
            return true;
        } else {
            const errorData = await response.json();
            console.error('❌ Telegram API error:', errorData);
            return false;
        }
    } catch (error) {
        console.error('❌ Network error:', error);
        return false;
    }
}

function formatOrderMessage(order) {
    return `
🛒 *New Order Received!* - Dinhata Buzzer Hub
━━━━━━━━━━━━━━━━━━━━
🆔 *Order ID:* ${order.id}
👤 *Customer:* ${order.name}
📞 *Phone:* ${order.phone}
📍 *Address:* ${order.address}
📌 *Pincode:* ${order.pincode}
${order.landmark ? `🏷️ *Landmark:* ${order.landmark}` : ''}
${order.instructions ? `📝 *Instructions:* ${order.instructions}` : ''}

💰 *Order Value:*
• Subtotal: ₹${order.subtotal}
• Delivery: ₹${order.delivery}
• *Total: ₹${order.total}*

🛍️ *Items Ordered:*
${order.items.map(item => `• ${item.name} - ₹${item.price}`).join('\n')}

📅 *Order Date:* ${order.date}
⏰ *Order Time:* ${new Date().toLocaleTimeString('en-IN')}
━━━━━━━━━━━━━━━━━━━━
*Thank you for using Dinhata Buzzer Hub!*
    `;
}

// ✅ -------- PRODUCT FUNCTIONS --------

// Load all products from localStorage
function getProducts() {
    try {
        const saved = JSON.parse(localStorage.getItem("dinhata_products"));
        if (saved && Array.isArray(saved)) return saved;
    } catch (e) {
        console.error("Product load error:", e);
    }

    // Default products (first-time load)
    const defaults = [
        {
            id: 1,
            name: "Samsung Galaxy M34 5G (Midnight Blue, 128 GB)",
            price: 15999,
            originalPrice: 18999,
            discount: 16,
            img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
            category: "electronics",
            rating: 4.3
        },
        {
            id: 2,
            name: "Nike Men's Running Shoes - Latest Collection",
            price: 3499,
            originalPrice: 4999,
            discount: 30,
            img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
            category: "fashion",
            rating: 4.5
        },
        {
            id: 3,
            name: "Sony 80 cm (32 inches) HD Ready Smart LED TV",
            price: 16999,
            originalPrice: 22999,
            discount: 26,
            img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
            category: "electronics",
            rating: 4.2
        },
        {
            id: 4,
            name: "Women's Cotton Silk Saree with Blouse Piece",
            price: 899,
            originalPrice: 1599,
            discount: 44,
            img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400",
            category: "fashion",
            rating: 4.4
        },
        {
            id: 5,
            name: "Kitchen Cookware Set - 15 Pieces",
            price: 2499,
            originalPrice: 3999,
            discount: 38,
            img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
            category: "home",
            rating: 4.1
        },
        {
            id: 6,
            name: "Wireless Bluetooth Headphones with Mic",
            price: 1299,
            originalPrice: 1999,
            discount: 35,
            img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            category: "electronics",
            rating: 4.0
        },
        {
            id: 7,
            name: "Organic Grocery Package - Weekly Essentials",
            price: 1299,
            originalPrice: 1799,
            discount: 28,
            img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
            category: "grocery",
            rating: 4.3
        },
        {
            id: 8,
            name: "Premium Beauty Kit - Complete Set",
            price: 1999,
            originalPrice: 2999,
            discount: 33,
            img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
            category: "beauty",
            rating: 4.2
        }
    ];

    localStorage.setItem("dinhata_products", JSON.stringify(defaults));
    return defaults;
}

// Save products list
function saveProducts(list) {
    localStorage.setItem("dinhata_products", JSON.stringify(list));
}

// ✅ -------- CART FUNCTIONS --------

// Load cart
function getCart() {
    try {
        return JSON.parse(localStorage.getItem("dinhata_cart")) || [];
    } catch {
        return [];
    }
}

// Save cart
function saveCart(list) {
    localStorage.setItem("dinhata_cart", JSON.stringify(list));
}

// Add to cart
function addToCart(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
        alert("Product not found!");
        return;
    }

    const cart = getCart();
    cart.push({ ...product, cartId: Date.now() });

    saveCart(cart);
    alert("✅ Product added to cart!");
    
    updateCartCount();
}

// Remove from cart
function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    return cart;
}

// Update cart count in header
function updateCartCount() {
    const count = getCart().length;
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Clear cart
function clearCart() {
    localStorage.removeItem("dinhata_cart");
    updateCartCount();
}

// ✅ -------- NAVIGATION FUNCTIONS --------

// Setup navigation active states
function setupNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll("nav a").forEach(link => {
        const linkPage = link.getAttribute("href");
        
        // Remove existing active styles
        link.style.color = "";
        link.style.fontWeight = "";
        
        // Set active style for current page
        if (linkPage === currentPage || 
            (currentPage === "" && linkPage === "index.html") ||
            (currentPage === "index.html" && linkPage === "index.html")) {
            link.style.color = "#2874f0";
            link.style.fontWeight = "600";
        }
    });
}

// ✅ -------- UTILITY FUNCTIONS --------

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

// Debounce function for search
function debounce(func, wait) {
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

// Get category display name
function getCategoryDisplayName(category) {
    const categoryMap = {
        'electronics': 'Electronics',
        'fashion': 'Fashion',
        'home': 'Home & Kitchen',
        'grocery': 'Grocery',
        'beauty': 'Beauty',
        'sports': 'Sports'
    };
    return categoryMap[category] || category;
}

// Validate phone number
function validatePhoneNumber(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// Validate pincode
function validatePincode(pincode) {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ✅ -------- ORDER MANAGEMENT --------

// Place order function
async function placeOrder(orderData) {
    try {
        // Save order to localStorage
        localStorage.setItem('dinhata_last_order', JSON.stringify(orderData));
        
        // Send to Telegram
        const telegramResult = await sendToTelegram(orderData);
        
        // Clear cart
        localStorage.removeItem('dinhata_cart');
        
        // Update UI
        updateCartCount();
        
        return {
            success: true,
            orderId: orderData.id,
            telegramSent: telegramResult,
            message: 'Order placed successfully!'
        };
        
    } catch (error) {
        console.error('Order placement error:', error);
        return {
            success: false,
            message: 'Order placed but notification failed'
        };
    }
}

// Get order history
function getOrderHistory() {
    try {
        return JSON.parse(localStorage.getItem('dinhata_order_history')) || [];
    } catch {
        return [];
    }
}

// Save order to history
function saveOrderToHistory(order) {
    const history = getOrderHistory();
    history.unshift(order);
    localStorage.setItem('dinhata_order_history', JSON.stringify(history.slice(0, 50))); // Keep last 50 orders
}

// ✅ -------- INITIALIZATION --------

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    updateCartCount();
    setupNavigation();
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize products if not exists
    getProducts();
});

// Export functions for global use
window.getProducts = getProducts;
window.saveProducts = saveProducts;
window.getCart = getCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartCount = updateCartCount;
window.clearCart = clearCart;
window.setupNavigation = setupNavigation;
window.sendToTelegram = sendToTelegram;
window.placeOrder = placeOrder;
window.formatCurrency = formatCurrency;
window.validatePhoneNumber = validatePhoneNumber;
window.validatePincode = validatePincode;
window.showNotification = showNotification;
window.getCategoryDisplayName = getCategoryDisplayName;

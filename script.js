// ✅ GLOBAL SCRIPT FOR DINHATA SHOP
console.log("✅ Dinhata Shop JavaScript Loaded");

// ✅ -------- PRODUCT FUNCTIONS --------

// Load all products from localStorage
function getProducts() {
    try {
        const saved = JSON.parse(localStorage.getItem("dinhata_products"));
        if (saved && Array.isArray(saved)) return saved;
    } catch (e) {
        console.error("Product load error:", e);
    }

    // ✅ Default products (first-time load)
    const defaults = [
        {
            id: 1,
            name: "Stylish Men's T-Shirt",
            price: 299,
            img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
            cat: "clothing"
        },
        {
            id: 2,
            name: "Premium Ladies Kurti",
            price: 480,
            img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
            cat: "clothing"
        },
        {
            id: 3,
            name: "Wireless Earbuds",
            price: 650,
            img: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
            cat: "electronics"
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

// Update cart count (optional future use)
function updateCartCount() {
    const count = getCart().length;
    const cartBtn = document.querySelector(".cart-count");
    if (cartBtn) cartBtn.textContent = count;
}



// ✅ -------- NAVIGATION ACTIVE HIGHLIGHT --------

function setupNavigation() {
    const path = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("nav a").forEach(link => {
        const page = link.getAttribute("href");

        if (page === path) {
            link.style.color = "#ffcc66";
            link.style.fontWeight = "bold";
        }
    });
}

document.addEventListener("DOMContentLoaded", setupNavigation);

// Yemek Sipariş Uygulaması - JavaScript

let appData = null;
let currentCategoryId = null;
let currentProductId = null;

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    initializeApp();
});

// JSON verisini yükle
async function loadData() {
    try {
        const response = await fetch('data.json');
        appData = await response.json();
    } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        // Fallback: Eğer fetch başarısız olursa, localStorage'dan yükle
        const savedData = localStorage.getItem('appData');
        if (savedData) {
            appData = JSON.parse(savedData);
        }
    }
}

// Uygulamayı başlat
function initializeApp() {
    loadCategories();
    updateCartCount();
    setupEventListeners();
    loadCartFromStorage();
}

// Event listener'ları ayarla
function setupEventListeners() {
    // Sepet butonları
    document.getElementById('cart-icon').addEventListener('click', () => showPage('cart-page'));
    document.getElementById('cart-icon-products').addEventListener('click', () => showPage('cart-page'));
    
    // Arama
    document.getElementById('search-input').addEventListener('input', handleSearch);
    
    // Sipariş tamamla
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
}

// Kategorileri yükle
function loadCategories() {
    const categoriesList = document.getElementById('categories-list');
    if (!appData || !appData.categories) return;
    
    categoriesList.innerHTML = '';
    
    appData.categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.innerHTML = `
            <div class="icon">${category.icon}</div>
            <div class="name">${category.name}</div>
        `;
        categoryCard.addEventListener('click', () => showProducts(category.id, category.name));
        categoriesList.appendChild(categoryCard);
    });
}

// Ürünleri göster
function showProducts(categoryId, categoryName) {
    currentCategoryId = categoryId;
    const products = appData.products.filter(p => p.categoryId === categoryId);
    
    document.getElementById('category-title').textContent = categoryName;
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';
    
    if (products.length === 0) {
        productsList.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">Bu kategoride ürün bulunmamaktadır.</p>';
    } else {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.name;
            img.className = 'product-image';
            img.loading = 'lazy'; // Lazy loading için
            
            productCard.innerHTML = `
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-footer">
                        <div class="product-price">${product.price.toFixed(2)} ₺</div>
                        <div class="product-rating">
                            ⭐ ${product.rating}
                        </div>
                    </div>
                </div>
            `;
            productCard.insertBefore(img, productCard.firstChild);
            productCard.addEventListener('click', () => showProductDetail(product.id));
            productsList.appendChild(productCard);
        });
    }
    
    showPage('products-page');
}

// Ürün detayını göster
function showProductDetail(productId) {
    currentProductId = productId;
    const product = appData.products.find(p => p.id === productId);
    
    if (!product) return;
    
    const productDetail = document.getElementById('product-detail');
    
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.className = 'detail-image';
    img.loading = 'lazy'; // Lazy loading için
    
    productDetail.innerHTML = `
        <div class="product-detail-card">
            <div class="detail-info">
                <div class="detail-name">${product.name}</div>
                <div class="detail-rating">⭐ ${product.rating}</div>
                <div class="detail-description">${product.description}</div>
                <div class="detail-price">${product.price.toFixed(2)} ₺</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Sepete Ekle
                </button>
            </div>
        </div>
    `;
    const card = productDetail.querySelector('.product-detail-card');
    card.insertBefore(img, card.firstChild);
    
    showPage('product-detail-page');
}

// Sepete ekle
function addToCart(productId) {
    const product = appData.products.find(p => p.id === productId);
    if (!product) return;
    
    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartCount();
    showToast('Ürün sepete eklendi!');
}

// Sepeti göster
function showCart() {
    const cart = getCart();
    const cartItems = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Sepetiniz boş</h3>
                <p>Alışverişe başlamak için kategorilerden birini seçin.</p>
            </div>
        `;
        document.getElementById('checkout-btn').disabled = true;
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)} ₺</div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Kaldır</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        document.getElementById('checkout-btn').disabled = false;
    }
    
    updateCartTotal();
    showPage('cart-page');
}

// Miktarı güncelle
function updateQuantity(productId, change) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        saveCart(cart);
        showCart();
        updateCartCount();
    }
}

// Sepetten kaldır
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    showCart();
    updateCartCount();
    showToast('Ürün sepetten kaldırıldı!');
}

// Sepet toplamını güncelle
function updateCartTotal() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total-price').textContent = total.toFixed(2) + ' ₺';
}

// Sepet sayısını güncelle
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
    document.getElementById('cart-count-products').textContent = count;
}

// Sepeti localStorage'dan al
function getCart() {
    const cartJson = localStorage.getItem('cart');
    return cartJson ? JSON.parse(cartJson) : [];
}

// Sepeti localStorage'a kaydet
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Sepeti localStorage'dan yükle (sayfa yüklendiğinde)
function loadCartFromStorage() {
    updateCartCount();
}

// Sayfa göster
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    // Sepet sayfasıysa sepeti güncelle
    if (pageId === 'cart-page') {
        showCart();
    }
}

// Geri git
function goBack() {
    const pages = ['home-page', 'products-page', 'product-detail-page', 'cart-page'];
    const currentPage = document.querySelector('.page.active').id;
    const currentIndex = pages.indexOf(currentPage);
    
    if (currentIndex > 0) {
        showPage(pages[currentIndex - 1]);
    }
}

// Arama
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length < 2) return;
    
    const filteredProducts = appData.products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    if (filteredProducts.length > 0) {
        // Arama sonuçlarını göster
        document.getElementById('category-title').textContent = 'Arama Sonuçları';
        const productsList = document.getElementById('products-list');
        productsList.innerHTML = '';
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-footer">
                        <div class="product-price">${product.price.toFixed(2)} ₺</div>
                        <div class="product-rating">⭐ ${product.rating}</div>
                    </div>
                </div>
            `;
            productCard.addEventListener('click', () => showProductDetail(product.id));
            productsList.appendChild(productCard);
        });
        
        showPage('products-page');
    }
}

// Siparişi tamamla
function handleCheckout() {
    const cart = getCart();
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (confirm(`Toplam: ${total.toFixed(2)} ₺\n\nSiparişi tamamlamak istediğinize emin misiniz?`)) {
        // Sepeti temizle
        localStorage.removeItem('cart');
        updateCartCount();
        showCart();
        showToast('Siparişiniz alındı! 🎉');
        
        // Ana sayfaya dön
        setTimeout(() => {
            showPage('home-page');
        }, 2000);
    }
}

// Toast bildirimi göster
function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Global fonksiyonlar (HTML'den erişilebilir olması için)
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.goBack = goBack;
window.showCart = showCart;


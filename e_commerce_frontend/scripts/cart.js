// Gestion du panier avec localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Ajouter un produit au panier
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartCount();
}

// Mettre à jour la quantité d'un produit
function updateCartItem(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
        }
    }
}

// Supprimer un produit du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCartItems(); // Recharger l'affichage si on est sur la page panier
    updateCartCount();
}

// Vider le panier
function clearCart() {
    cart = [];
    saveCart();
    displayCartItems(); // Recharger l'affichage si on est sur la page panier
    updateCartCount();
}

// Sauvegarder le panier dans localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Calculer le total du panier
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Afficher les articles du panier
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cartItemsContainer && cartTotalElement) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Votre panier est vide</p>';
            document.getElementById('checkout-btn').style.display = 'none';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>${item.price.toFixed(2)} €</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">Supprimer</button>
                    <div class="cart-item-total">
                        ${(item.price * item.quantity).toFixed(2)} €
                    </div>
                </div>
            `).join('');
            
            // Ajouter les événements
            document.querySelectorAll('.quantity-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = e.target.getAttribute('data-id');
                    const action = e.target.getAttribute('data-action');
                    const item = cart.find(item => item.id === productId);
                    
                    if (item) {
                        if (action === 'increase') {
                            updateCartItem(productId, item.quantity + 1);
                        } else if (action === 'decrease') {
                            updateCartItem(productId, item.quantity - 1);
                        }
                    }
                });
            });
            
            document.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = e.target.getAttribute('data-id');
                    removeFromCart(productId);
                });
            });
        }
        
        cartTotalElement.textContent = calculateCartTotal().toFixed(2);
    }
}

// Mettre à jour le compteur du panier
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Exporter les fonctions nécessaires
window.addToCart = addToCart;
window.updateCartItem = updateCartItem;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.displayCartItems = displayCartItems;
window.updateCartCount = updateCartCount;
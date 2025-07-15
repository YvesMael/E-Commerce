// Données simulées pour les produits
const featuredProducts = [
    { id: 1, name: "Pommes Locales", price: 2.50, image: "./images/R.jpeg" },
    { id: 2, name: "Pain au Levain", price: 4.00, image: "./images/R.jpeg" },
    { id: 3, name: "Miel d'Abeille", price: 7.90, image: "./images/R.jpeg" },
    { id: 4, name: "Fromage de Chèvre", price: 12.00, image: "./images/R.jpeg" },
];

const cart = []; // Panier vide

// Fonction pour afficher les produits en vedette
function displayFeaturedProducts() {
    const productGrid = document.querySelector('.product-grid');
    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price.toFixed(2)}€</p>
            <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">Ajouter au panier</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Fonction pour ajouter un produit au panier
function addToCart(productId) {
    const productToAdd = featuredProducts.find(p => p.id === parseInt(productId));
    if (productToAdd) {
        cart.push(productToAdd);
        updateCartCount();
        console.log("Produit ajouté au panier :", productToAdd);
    }
}

// Fonction pour mettre à jour le compteur du panier
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = cart.length;
}

// Écouteurs d'événements
document.addEventListener('DOMContentLoaded', () => {
    // Afficher les produits lors du chargement de la page
    displayFeaturedProducts();

    // Écouteur pour les boutons "Ajouter au panier"
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = e.target.getAttribute('data-product-id');
                addToCart(productId);
            }
        });
    }
});
const API_BASE_URL = 'http://localhost:8000/api'; // Ajustez selon votre configuration

// Fonction générique pour les requêtes API
async function fetchAPI(endpoint, method = 'GET', data = null, requiresAuth = false) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (requiresAuth) {
        const token = localStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            throw new Error('Authentification requise');
        }
    }
    
    const config = {
        method,
        headers,
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur API');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
}

// Produits
export async function getProducts(category = '', sort = '') {
    let endpoint = '/products/';
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (sort) params.append('sort', sort);
    
    if (params.toString()) {
        endpoint += `?${params.toString()}`;
    }
    
    return fetchAPI(endpoint);
}

export async function getProduct(id) {
    return fetchAPI(`/products/${id}/`);
}

// Panier
export async function getCart() {
    return fetchAPI('/cart/', 'GET', null, true);
}

export async function addToCartAPI(productId, quantity = 1) {
    return fetchAPI('/cart/items/', 'POST', { product_id: productId, quantity }, true);
}

export async function updateCartItemAPI(itemId, quantity) {
    return fetchAPI(`/cart/items/${itemId}/`, 'PUT', { quantity }, true);
}

export async function removeFromCartAPI(itemId) {
    return fetchAPI(`/cart/items/${itemId}/`, 'DELETE', null, true);
}

export async function clearCartAPI() {
    return fetchAPI('/cart/clear/', 'POST', null, true);
}

// Commandes
export async function createOrder(cart, shippingAddress, paymentMethod) {
    return fetchAPI('/orders/', 'POST', { 
        items: cart,
        shipping_address: shippingAddress,
        payment_method: paymentMethod 
    }, true);
}

export async function getOrders() {
    return fetchAPI('/orders/', 'GET', null, true);
}

// Authentification
export async function login(username, password) {
    return fetchAPI('/auth/login/', 'POST', { username, password });
}

export async function register(username, email, password) {
    return fetchAPI('/auth/register/', 'POST', { username, email, password });
}

export async function getCurrentUser() {
    return fetchAPI('/auth/user/', 'GET', null, true);
}
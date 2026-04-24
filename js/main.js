import { initializeAuth } from './auth.js';
import { loadProducts } from './products.js';
import { initializeCart } from './cart.js';

// Configuração inicial
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    loadProducts();
    initializeCart();
});

// Gerenciamento de estado global
const store = {
    user: null,
    cart: [],
    products: [],
};

// Sistema de eventos personalizado
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

export const eventBus = new EventEmitter();

// Animações
const animateElement = (element, animation) => {
    element.style.animation = animation;
    element.addEventListener('animationend', () => {
        element.style.animation = '';
    });
};

// Utilitários
export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

// Sistema de notificações
export const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
};

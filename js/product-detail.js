// Gerenciamento de estado
const productState = {
    selectedSize: null,
    quantity: 1,
    isFavorite: false
};

// Seleção de tamanho
document.querySelectorAll('.size-option').forEach(button => {
    button.addEventListener('click', (e) => {
            document.querySelectorAll('.size-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        e.target.classList.add('selected');
        productState.selectedSize = e.target.dataset.size;
    });
});

// Controle de quantidade
function updateQuantity(change) {
    const input = document.getElementById('quantity');
    let newValue = parseInt(input.value) + change;
    
    if (newValue < 1) newValue = 1;
    if (newValue > 10) newValue = 10;
    
    input.value = newValue;
    productState.quantity = newValue;
}

// Gerenciamento do botão de favoritos
// Adicione esta função onde você mostra os produtos
function addToFavorites(product) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('Faça login para adicionar aos favoritos');
        window.location.href = 'login.html';
        return;
    }

    let favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.email}`) || '[]');
    
    // Verificar se já está nos favoritos
    if (favorites.some(item => item.id === product.id)) {
        alert('Este item já está nos seus favoritos!');
        return;
    }

    // Adicionar aos favoritos
    favorites.push(product);
    localStorage.setItem(`favorites_${currentUser.email}`, JSON.stringify(favorites));
    alert('Produto adicionado aos favoritos!');
}


// Guia de tamanhos
function openSizeGuide() {
    const modal = document.getElementById('size-guide-modal');
    modal.style.display = 'block';
}

document.querySelector('.close-modal')?.addEventListener('click', () => {
    document.getElementById('size-guide-modal').style.display = 'none';
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('size-guide-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Calculadora de frete
async function calculateShipping() {
    const cepInput = document.querySelector('.shipping-input input');
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        showNotification('Por favor, digite um CEP válido', 'error');
        return;
    }

    // Simulação de cálculo de frete
    showLoadingShipping();
    
    setTimeout(() => {
        const shippingOptions = [
            { service: 'PAC', price: 15.90, days: 5 },
            { service: 'SEDEX', price: 25.90, days: 2 }
        ];
        
        showShippingResults(shippingOptions);
    }, 1000);
}

function showLoadingShipping() {
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'shipping-results';
    resultsDiv.innerHTML = '<p>Calculando frete...</p>';
    
    const existingResults = document.getElementById('shipping-results');
    if (existingResults) {
        existingResults.remove();
    }
    
    document.querySelector('.shipping-calculator').appendChild(resultsDiv);
}

function showShippingResults(options) {
    const resultsDiv = document.getElementById('shipping-results');
    resultsDiv.innerHTML = `
        <div class="shipping-options">
            ${options.map(option => `
                <div class="shipping-option">
                    <span class="service">${option.service}</span>
                    <span class="price">R$ ${option.price.toFixed(2)}</span>
                    <span class="days">${option.days} dias úteis</span>
                </div>
            `).join('')}
        </div>
    `;
}

// Sistema de tabs
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Função de notificação personalizada
function showCustomNotification(type, message) {
    // Remove notificações anteriores
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Cria a nova notificação
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    
    // Define o conteúdo baseado no tipo de notificação
    if (type === 'success') {
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-check"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">Produto Adicionado!</div>
                <div class="notification-message">${message}</div>
            </div>
            <div class="notification-progress">
                <div class="progress-bar"></div>
            </div>
        `;
    } else if (type === 'error') {
        notification.innerHTML = `
            <div class="notification-icon error">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">Atenção!</div>
                <div class="notification-message">${message}</div>
            </div>
            <div class="notification-progress">
                <div class="progress-bar error"></div>
            </div>
        `;
    }

    document.body.appendChild(notification);

    // Mostra a notificação com um pequeno delay
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remove a notificação após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Modifique a parte do código que adiciona ao carrinho
document.querySelector('.buy-button').addEventListener('click', () => {
    if (!productState.selectedSize) {
        showCustomNotification('error', 'Por favor, selecione um tamanho!');
        return;
    }

    const product = {
        id: document.querySelector('.buy-button').dataset.id,
        name: document.querySelector('.buy-button').dataset.name,
        price: parseFloat(document.querySelector('.buy-button').dataset.price),
        size: productState.selectedSize,
        quantity: productState.quantity,
        image: document.querySelector('.product-front img').src
    };

    // Integração com o carrinho
    if (typeof cart !== 'undefined') {
        cart.addToCart(product);
        showCustomNotification('success', `${product.name} - Tamanho ${product.size} foi adicionado ao seu carrinho`);
    }
});

// Atualize os estilos CSS para incluir os estilos de erro
const notificationStyles = `
    .custom-notification {
        position: fixed;
        top: 30px;
        right: 30px;
        background: #242424;
        color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 15px;
        transform: translateX(150%);
        transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        z-index: 1000;
        max-width: 400px;
    }

    .custom-notification.show {
        transform: translateX(0);
    }

    .notification-icon {
        width: 40px;
        height: 40px;
        background: #837e7e;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .notification-icon.error {
        background: #ff4444;
    }

    .notification-icon i {
        color: #000000;
        font-size: 1.2em;
    }

    .notification-content {
        flex-grow: 1;
    }

    .notification-title {
        font-weight: bold;
        margin-bottom: 5px;
        font-size: 1.1em;
    }

    .notification-message {
        font-size: 0.9em;
        color: #cccccc;
    }

    .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: #333333;
        border-radius: 0 0 10px 10px;
        overflow: hidden;
    }

    .progress-bar {
        height: 100%;
        background: #837e7e;
        width: 100%;
        transform-origin: left;
        animation: progress 3s linear forwards;
    }

    .progress-bar.error {
        background: #ff4444;
    }

    @keyframes progress {
        from {
            transform: scaleX(1);
        }
        to {
            transform: scaleX(0);
        }
    }

    /* Responsividade */
    @media (max-width: 576px) {
        .custom-notification {
            width: 90%;
            right: 5%;
            top: 20px;
        }
    }
`;

// Adicione os novos estilos
const styleElement = document.createElement('style');
styleElement.textContent = notificationStyles;
document.head.appendChild(styleElement);



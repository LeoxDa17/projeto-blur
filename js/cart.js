class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupEventListeners();
        this.renderCartPage();
    }

    setupEventListeners() {
        // Evento para os botões de tamanho
        document.querySelectorAll('.size-option').forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove a classe 'selected' de todos os botões no mesmo grupo
                const parent = e.target.closest('.sizes');
                parent.querySelectorAll('.size-option').forEach(btn => {
                    btn.classList.remove('selected');
                });
                // Adiciona a classe 'selected' ao botão clicado
                e.target.classList.add('selected');
            });
        });

        // Evento para adicionar ao carrinho
        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const selectedSize = productCard.querySelector('.size-option.selected');



                const product = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    price: parseFloat(button.dataset.price),
                    size: selectedSize.dataset.size,
                    quantity: 1,
                    image: productCard.querySelector('.product-front img').src
                };

                this.addToCart(product);
            });
        });

       

        // Eventos para a página do carrinho
        const cartItemsContainer = document.getElementById('cart-items');
        if (cartItemsContainer) {
            cartItemsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-btn')) {
                    const itemId = e.target.dataset.id;
                    const itemSize = e.target.dataset.size;
                    this.removeFromCart(itemId, itemSize);
                }
            });
        }
    }

    addToCart(product) {
        console.log('Adicionando produto:', product); // Debug
        
        const existingItem = this.items.find(item => 
            item.id === product.id && item.size === product.size
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push(product);
        }

        this.saveCart();
        this.updateCartCount();
        alert('Produto adicionado ao carrinho!');
    }

    removeFromCart(id, size) {
        this.items = this.items.filter(item => 
            !(item.id === id && item.size === size)
        );
        this.saveCart();
        this.updateCartCount();
        this.renderCartPage();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    renderCartPage() {
        const cartItemsContainer = document.getElementById('cart-items');
        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
            this.updateTotal(0);
            return;
        }

        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>Tamanho: ${item.size}</p>
                    <p>Preço: R$ ${item.price.toFixed(2)}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <button class="remove-btn" data-id="${item.id}" data-size="${item.size}">
                        Remover
                    </button>
                </div>
            </div>
        `).join('');

        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.updateTotal(total);
    }

    updateTotal(total) {
        const totalElement = document.getElementById('cart-total');
        if (totalElement) {
            totalElement.textContent = `R$ ${total.toFixed(2)}`;
        }
    }
}

// Inicializar o carrinho
const cart = new ShoppingCart();

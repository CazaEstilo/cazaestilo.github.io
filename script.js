// --- CONFIGURACIÓN DE PRODUCTOS ---
const productsData = [
    {
        id: 1,
        name: "Conjunto Corazon",
        description: "Comodidad y presencia. Este conjunto de dos piezas te hará destacar sin esfuerzo.",
        price: 94900,
        images: ["imagenes/conjunto1.jpg", "imagenes/conjunto2"], 
        sizes: ["XL"], 
        soldOut: false,
        sizeGuide: { // Guía para Chaquetas/Conjuntos
            headers: ["Talla", "Pecho (CM)", "Largo (CM)"],
            data: [
                ["S", "96-100", "68"],
                ["M", "101-105", "70"],
                ["L", "106-110", "72"],
                ["XL", "111-115", "74"]
            ]
        }
    },
    {
        id: 2,
        name: "Chaqueta Angeles",
        description: "Chaqueta con caída holgada. El toque perfecto para un look imponente y moderno.",
        price: 97900,
        images: ["imagenes/angeles1.jpg", "imagenes/angeles2.jpg"],
        sizes: ["L"], 
        soldOut: false,
        sizeGuide: { // Guía para Chaquetas/Conjuntos
            headers: ["Talla", "Pecho (CM)", "Largo (CM)"],
            data: [
                ["S", "98", "65"],
                ["M", "103", "67"],
                ["L", "108", "69"]
            ]
        }
    },
    {
        id: 3,
        name: "Jean cafe",
        description: "Durabilidad y diseño. Bolsillos laterales que redefinen la silueta casual.",
        price: 132900,
        images: ["imagenes/jeancafe1.jpg", "imagenes/jeancafe2.jpg"],
        sizes: ["32"], 
        soldOut: flase, // Aún agotado "true"
        sizeGuide: { // Guía para Jeans
            headers: ["Talla", "Cintura (CM)", "Cadera (CM)"],
            data: [
                ["28", "72", "92"],
                ["30", "77", "97"],
                ["32", "82", "102"],
                ["34", "87", "107"]
            ]
        }
    },
    {
        id: 4,
        name: "Jean blanco",
        description: "Durabilidad y diseño. Bolsillos laterales que redefinen la silueta casual.",
        price: 110900,
        images: ["imagenes/jeanblanco1.jpg", "imagenes/jeanblanco2.jpg"],
        sizes: ["32"], 
        soldOut: flase, // Aún agotado "true"
        sizeGuide: { // Guía para Jeans
            headers: ["Talla", "Cintura (CM)", "Cadera (CM)"],
            data: [
                ["28", "72", "92"],
                ["30", "77", "97"],
                ["32", "82", "102"],
                ["34", "87", "107"]
            ]
        }
    },
    {
        id: 5,
        name: "Jean negro",
        description: "Durabilidad y diseño. Bolsillos laterales que redefinen la silueta casual.",
        price: 110900,
        images: ["imagenes/jeannegro1.jpg", "imagenes/jeannegro2.jpg"],
        sizes: ["32"], 
        soldOut: flase, // Aún agotado "true"
        sizeGuide: { // Guía para Jeans
            headers: ["Talla", "Cintura (CM)", "Cadera (CM)"],
            data: [
                ["28", "72", "92"],
                ["30", "77", "97"],
                ["32", "82", "102"],
                ["34", "87", "107"]
            ]
        }
    },
    {
        id: 6,
        name: "Saco",
        description: "Algodón premium con diseño exclusivo. Arte callejero para tu día a día.",
        price: 105900,
        images: ["imagenes/buzo1.jpg", "imagenes/buzo2.jpg"],
        sizes: ["XL"], 
        soldOut: false,
        sizeGuide: { // Guía para Camisetas
            headers: ["Talla", "Pecho (CM)", "Hombro (CM)"],
            data: [
                ["XS", "90", "40"],
                ["S", "95", "42"],
                ["M", "100", "44"],
                ["L", "105", "46"],
                ["XL", "110", "48"]
            ]
        }
    }
];

let cart = JSON.parse(localStorage.getItem('cazaEstiloCart')) || [];
let currentProductId = null; // Almacena el ID del producto que abrió el modal

// --- UTILITIES Y FEEDBACK VISUAL ---

function formatPrice(price) {
    return `$${price.toLocaleString('es-CO')} COP`;
}

/**
 * Muestra un toast de notificación (UX)
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    if (type === 'error') {
        toast.classList.add('error');
    }
    
    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-triangle"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500); 
    }, 3000); 
}

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countElement.textContent = totalItems;
}

// --- CARRUSELES Y RENDERIZADO (Se mantienen igual) ---

function initializeSwipers() {
    document.querySelectorAll('.product-carousel').forEach(carouselElement => {
        const productID = carouselElement.closest('.product').dataset.id;
        new Swiper(carouselElement, {
            slidesPerView: 1,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: `.swiper-pagination[data-product-id="${productID}"]`,
                clickable: true,
            },
            navigation: {
                nextEl: `.swiper-button-next[data-product-id="${productID}"]`,
                prevEl: `.swiper-button-prev[data-product-id="${productID}"]`,
            },
        });
    });
}

function initializeTestimonialCarousel() {
    new Swiper('.testimonials-carousel', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        speed: 800,
        pagination: {
            el: '.testimonial-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.testimonial-next',
            prevEl: '.testimonial-prev',
        },
        breakpoints: {
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 40 }
        }
    });
}

function loadProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = productsData.map(product => {
        const isSoldOut = product.soldOut ? 'sold-out' : '';
        
        const imagesHtml = product.images.map(image => `
            <div class="swiper-slide">
                <img src="${image}" alt="${product.name}">
            </div>
        `).join('');

        return `
            <div class="product ${isSoldOut}" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                
                <div class="product-carousel swiper-container">
                    <div class="swiper-wrapper">
                        ${imagesHtml}
                    </div>
                    <div class="swiper-pagination" data-product-id="${product.id}"></div>
                    <div class="swiper-button-prev" data-product-id="${product.id}"></div>
                    <div class="swiper-button-next" data-product-id="${product.id}"></div>
                </div>

                <div class="product-info">
                    <div>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                    </div>
                    <div class="product-price-meta">
                        <span class="price-tag">${formatPrice(product.price)}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn add-to-cart-btn" onclick="openSizeModal(${product.id})" ${product.soldOut ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i> Añadir al Carrito
                        </button>
                        <a href="https://wa.me/573012705080?text=${encodeURIComponent(`Hola, me interesa el producto: ${product.name} (${formatPrice(product.price)}).`)}" target="_blank" class="btn btn-whatsapp">
                            <i class="fab fa-whatsapp"></i> Cazala Ya
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    initializeSwipers();
}

// --- LÓGICA DEL MODAL Y GUÍA DE TALLAS (CORREGIDO) ---

/**
 * Abre un modal para seleccionar la talla.
 */
function openSizeModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product || product.soldOut) return;

    currentProductId = productId; // Almacena el ID actual

    const modal = document.getElementById('size-modal');
    const modalTitle = document.getElementById('size-modal-title');
    const sizeSelect = document.getElementById('product-size-select');
    const confirmButton = document.getElementById('confirm-size-button');

    modalTitle.textContent = product.name;
    
    // Rellena el select con las tallas disponibles
    sizeSelect.innerHTML = product.sizes.map(size => 
        `<option value="${size}">${size}</option>`
    ).join('');

    // Reestablece la vista al selector antes de abrir
    hideSizeGuide();

    // Se usa una función anónima para pasar el ID del producto y la talla
    confirmButton.onclick = () => {
        const selectedSize = sizeSelect.value;
        if (selectedSize) {
            addItemToCart(productId, selectedSize);
            closeSizeModal();
        }
    };

    modal.style.display = 'flex';
}

/**
 * Cierra el modal de tallas
 */
function closeSizeModal() {
    document.getElementById('size-modal').style.display = 'none';
    currentProductId = null;
}

/**
 * Genera la tabla de tallas y muestra la vista de guía.
 */
function showSizeGuide(event) {
    event.preventDefault(); // Evita que el link recargue la página
    
    const product = productsData.find(p => p.id === currentProductId);
    const guideContainer = document.getElementById('size-guide-table-container');
    
    if (!product || !product.sizeGuide) {
        guideContainer.innerHTML = '<p>Lo sentimos, la guía de tallas para este producto no está disponible. Por favor, contáctanos para asesoría.</p>';
        showToast('Guía no disponible.', 'error');
        return;
    }

    const guide = product.sizeGuide;
    let tableHTML = '<table><thead><tr>';
    
    // Encabezados
    guide.headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';

    // Datos
    guide.data.forEach(row => {
        tableHTML += '<tr>';
        row.forEach(cell => {
            tableHTML += `<td>${cell}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';

    guideContainer.innerHTML = tableHTML;
    
    // Muestra la vista de la guía y oculta el selector
    document.getElementById('size-selector-view').style.display = 'none';
    document.getElementById('size-guide-view').style.display = 'block';
}

/**
 * Oculta la tabla de tallas y muestra la vista de selección.
 */
function hideSizeGuide() {
    document.getElementById('size-selector-view').style.display = 'block';
    document.getElementById('size-guide-view').style.display = 'none';
}

// --- LÓGICA DEL CARRITO (Se mantiene igual) ---

/**
 * Añade un producto al carrito, incluyendo la talla y un ID único.
 */
function addItemToCart(productId, size) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const uniqueId = `${productId}-${size}`;
    const existingItem = cart.find(item => item.uniqueId === uniqueId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            uniqueId: uniqueId, 
            id: productId,
            name: product.name,
            size: size, 
            price: product.price,
            quantity: 1
        });
    }

    localStorage.setItem('cazaEstiloCart', JSON.stringify(cart));
    updateCartCount();
    
    // Feedback visual (animación y toast)
    const cartButton = document.getElementById('view-cart-button');
    cartButton.classList.add('cart-feedback');
    setTimeout(() => cartButton.classList.remove('cart-feedback'), 500);
    showToast(`"${product.name}" (Talla: ${size}) añadido.`);
}

/**
 * Gestiona la cantidad de un artículo en el carrito.
 */
function updateItemQuantity(uniqueId, change) {
    const itemIndex = cart.findIndex(item => item.uniqueId === uniqueId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            removeItem(uniqueId, false); 
            return;
        }

        localStorage.setItem('cazaEstiloCart', JSON.stringify(cart));
        updateCartCount();
        renderCartModal(); 
    }
}

/**
 * Elimina un artículo completo del carrito
 */
function removeItem(uniqueId, showFeedback = true) {
    const item = cart.find(item => item.uniqueId === uniqueId);
    
    if (item && showFeedback) {
        showToast(`"${item.name}" (Talla: ${item.size}) eliminado.`, 'error');
    }
    
    cart = cart.filter(item => item.uniqueId !== uniqueId);
    localStorage.setItem('cazaEstiloCart', JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
}

/**
 * Renderiza el contenido del modal del carrito.
 */
function renderCartModal() {
    const listElement = document.getElementById('cart-items-list');
    const totalElement = document.getElementById('cart-modal-total');
    const confirmButton = document.getElementById('confirm-whatsapp');
    let total = 0;

    if (cart.length === 0) {
        listElement.innerHTML = '<p>El carrito de cotización está vacío. ¡Empieza a cazar tu estilo!</p>';
        totalElement.textContent = formatPrice(0);
        confirmButton.disabled = true;
        return;
    }
    
    confirmButton.disabled = false;

    const itemsHtml = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item" data-unique-id="${item.uniqueId}">
                <div class="item-title-group">
                    <span class="item-title">${item.name}</span>
                    <span class="item-size"> (Talla: ${item.size || 'N/A'})</span>
                </div>
                <div class="item-controls">
                    <button class="control-btn" onclick="updateItemQuantity('${item.uniqueId}', -1)">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="control-btn" onclick="updateItemQuantity('${item.uniqueId}', 1)">+</button>
                </div>
                <span class="item-price">${formatPrice(itemTotal)}</span>
                <button class="remove-btn" onclick="removeItem('${item.uniqueId}')" aria-label="Eliminar producto"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }).join('');

    listElement.innerHTML = itemsHtml;
    totalElement.textContent = formatPrice(total);
}


function clearCart() {
    cart = [];
    localStorage.removeItem('cazaEstiloCart');
    updateCartCount();
    renderCartModal();
    showToast('Carrito vaciado con éxito.', 'error');
}


// Función para generar el mensaje de WhatsApp.
function getWhatsAppMessage() {
    const phone = '573012705080'; 
    let message = '¡Hola Caza Estilo! Estoy listo para confirmar mi cotización:\n\n';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `* ${item.name} (Talla: ${item.size || 'N/A'}) x${item.quantity} (${formatPrice(itemTotal)})\n`;
    });

    message += `\n*TOTAL ESTIMADO:* ${formatPrice(total)}\n\n`;
    message += 'Por favor, confírmenme la disponibilidad, el costo total con envío y el método de pago. ¡Gracias!';

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}


/* --- EVENT LISTENERS Y LÓGICA DE LA PÁGINA (Se mantiene igual) --- */

// LÓGICA PARA EL BOTÓN VOLVER ARRIBA
const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de menús y modales
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const cartModal = document.getElementById('cart-modal');
    const sizeModal = document.getElementById('size-modal');
    const viewCartButton = document.getElementById('view-cart-button');
    const confirmWhatsappButton = document.getElementById('confirm-whatsapp');
    
    // Toggle de menú móvil
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Cerrar menú móvil al hacer clic en un enlace
    document.querySelectorAll('.scroll-to-section').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Abrir modal de carrito
    viewCartButton.addEventListener('click', () => {
        renderCartModal();
        cartModal.style.display = 'flex';
    });
    
    // Enviar a WhatsApp desde el modal
    confirmWhatsappButton.addEventListener('click', () => {
        if (cart.length > 0) {
            window.open(getWhatsAppMessage(), '_blank');
            cartModal.style.display = 'none'; 
            clearCart(); // Vaciar carrito después de cotizar
        } else {
            showToast('Tu carrito está vacío. Agrega productos antes de cotizar.', 'error');
        }
    });

    // Cierre de modales al hacer clic fuera
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-modal-overlay')) {
                cartModal.style.display = 'none';
            }
        });
    }
    if (sizeModal) {
        sizeModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-modal-overlay')) {
                sizeModal.style.display = 'none';
                hideSizeGuide(); // Asegura que se vuelva al selector al cerrar
            }
        });
    }

    // Lógica de Scroll para efectos visuales
    const sections = document.querySelectorAll('section');
    const navbar = document.querySelector('.navbar');

    const checkScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight * 0.8;
        
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        sections.forEach(section => {
            if (section.offsetTop < scrollPosition) {
                section.classList.add('visible-section');
            }
        });
    };

    window.addEventListener('scroll', checkScroll);
    
    updateCartCount(); 
    document.querySelector('header').style.opacity = 1; 
});


// Lógica del Loader y carga de productos
const headerVideo = document.getElementById('header-video');

window.addEventListener('load', () => {
    // 1. Ocultar Loader
    const loader = document.querySelector('.loader-overlay');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 500); 

    // 2. Cargar productos e inicializar swipers
    loadProducts(); 
    initializeTestimonialCarousel(); 

    // 3. Asegurar reproducción de video
    if (headerVideo) {
           headerVideo.play().catch(error => {
               console.log("Autoplay de video bloqueado: ", error);
           });
    }
});
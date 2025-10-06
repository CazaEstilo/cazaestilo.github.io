// --- CONFIGURACIÓN DE PRODUCTOS (AÑADIDAS TALLAS PARA MEJOR USABILIDAD) ---
const productsData = [
    {
        id: 1,
        name: "Conjunto Estilo Urbano",
        description: "Comodidad y presencia. Este conjunto de dos piezas te hará destacar sin esfuerzo.",
        price: 180000,
        // **IMPORTANTE:** He corregido las rutas de las imágenes para que sean diferentes.
        images: ["imagenes/conjunto.jpg", "imagenes/producto1-2.jpg", "imagenes/producto1-3.jpg"], 
        sizes: ["S", "M", "L", "XL"], // AÑADIDO: Tallas disponibles
        soldOut: false
    },
    {
        id: 2,
        name: "Chaqueta Negra Oversize",
        description: "Chaqueta con caída holgada. El toque perfecto para un look imponente y moderno.",
        price: 240000,
        images: ["imagenes/jeanblanco.jpg", "imagenes/producto2-2.jpg"],
        sizes: ["S", "M", "L"], // AÑADIDO: Tallas disponibles
        soldOut: false
    },
    {
        id: 3,
        name: "Jean Cargo Streetwear",
        description: "Durabilidad y diseño. Bolsillos laterales que redefinen la silueta casual.",
        price: 155000,
        images: ["imagenes/jeancafe.jpg", "imagenes/producto3-2.jpg", "imagenes/producto3-3.jpg"],
        sizes: ["28", "30", "32", "34"], // AÑADIDO: Tallas disponibles (para jeans)
        soldOut: true // Ejemplo de producto agotado
    },
    {
        id: 4,
        name: "Camiseta Gráfica Vintage",
        description: "Algodón premium con diseño exclusivo. Arte callejero para tu día a día.",
        price: 90000,
        images: ["imagenes/producto4-1.jpg", "imagenes/producto4-2.jpg"],
        sizes: ["XS", "S", "M", "L", "XL"], // AÑADIDO: Tallas disponibles
        soldOut: false
    }
];

let cart = JSON.parse(localStorage.getItem('cazaEstiloCart')) || [];

// --- UTILITIES (Se mantienen igual) ---

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

// --- FUNCIÓN DE RENDERIZADO PRINCIPAL (PRODUCTOS) ---

// MODIFICADA: Ahora el botón de carrito llama a openSizeModal
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
                        <span class="price-tag">$${product.price.toLocaleString('es-CO')} COP</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn add-to-cart-btn" onclick="openSizeModal(${product.id})" ${product.soldOut ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i> Añadir al Carrito
                        </button>
                        <a href="https://wa.me/573012705080?text=${encodeURIComponent(`Hola, me interesa el producto: ${product.name} ($${product.price.toLocaleString('es-CO')} COP).`)}" target="_blank" class="btn btn-whatsapp">
                            <i class="fab fa-whatsapp"></i> Cazala Ya
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    initializeSwipers();
}

// --- LÓGICA DEL CARRITO CON TALLAS Y GESTIÓN (NUEVAS FUNCIONES) ---

/**
 * NUEVA FUNCIÓN: Abre un modal para seleccionar la talla antes de añadir al carrito.
 */
function openSizeModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product || product.soldOut) return;

    const modal = document.getElementById('size-modal');
    const modalTitle = document.getElementById('size-modal-title');
    const sizeSelect = document.getElementById('product-size-select');
    const confirmButton = document.getElementById('confirm-size-button');
    const firstSize = product.sizes.length > 0 ? product.sizes[0] : '';

    modalTitle.textContent = product.name;
    
    // Rellena el select con las tallas disponibles
    sizeSelect.innerHTML = product.sizes.map(size => 
        `<option value="${size}">${size}</option>`
    ).join('');

    // Limpiar listener previo y añadir el nuevo con la talla seleccionada
    // Se usa una función anónima para pasar el ID del producto y la talla
    confirmButton.onclick = () => {
        const selectedSize = sizeSelect.value;
        if (selectedSize) {
            addItemToCart(productId, selectedSize);
            modal.style.display = 'none';
        }
    };

    modal.style.display = 'flex';
}

/**
 * MODIFICADA: Añade un producto al carrito, incluyendo la talla y un ID único.
 */
function addItemToCart(productId, size) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // Generar un ID único basado en producto+talla para poder agruparlos
    const uniqueId = `${productId}-${size}`;

    const existingItem = cart.find(item => item.uniqueId === uniqueId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            uniqueId: uniqueId, // ID Único para gestionar en el carrito
            id: productId,
            name: product.name,
            size: size, // CRÍTICO: guardamos la talla
            price: product.price,
            quantity: 1
        });
    }

    localStorage.setItem('cazaEstiloCart', JSON.stringify(cart));
    updateCartCount();
    
    // Feedback visual
    const cartButton = document.getElementById('view-cart-button');
    cartButton.classList.add('cart-feedback');
    setTimeout(() => cartButton.classList.remove('cart-feedback'), 500);
}

/**
 * NUEVA FUNCIÓN: Gestiona la cantidad de un artículo en el carrito (+ o -)
 */
function updateItemQuantity(uniqueId, change) {
    const itemIndex = cart.findIndex(item => item.uniqueId === uniqueId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            // Eliminar si la cantidad llega a 0
            cart.splice(itemIndex, 1);
        }

        localStorage.setItem('cazaEstiloCart', JSON.stringify(cart));
        updateCartCount();
        renderCartModal(); // Volver a dibujar el modal para reflejar los cambios
    }
}

/**
 * NUEVA FUNCIÓN: Elimina un artículo completo del carrito
 */
function removeItem(uniqueId) {
    cart = cart.filter(item => item.uniqueId !== uniqueId);
    localStorage.setItem('cazaEstiloCart', JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
}

/**
 * MODIFICADA: Renderiza el contenido del modal del carrito con controles de cantidad y eliminación.
 */
function renderCartModal() {
    const listElement = document.getElementById('cart-items-list');
    const totalElement = document.getElementById('cart-modal-total');
    let total = 0;

    if (cart.length === 0) {
        listElement.innerHTML = '<p>El carrito de cotización está vacío. ¡Empieza a cazar tu estilo!</p>';
        totalElement.textContent = '$0';
        return;
    }

    // Usamos el nuevo formato de renderizado con botones de control
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
                <span class="item-price">$${itemTotal.toLocaleString('es-CO')} COP</span>
                <button class="remove-btn" onclick="removeItem('${item.uniqueId}')" aria-label="Eliminar producto"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }).join('');

    listElement.innerHTML = itemsHtml;
    totalElement.textContent = `$${total.toLocaleString('es-CO')} COP`;
}


// MODIFICADA: Función para vaciar el carrito (se mantiene igual)
function clearCart() {
    cart = [];
    localStorage.removeItem('cazaEstiloCart');
    updateCartCount();
    renderCartModal();
}


// MODIFICADA: Función para generar el mensaje de WhatsApp, ahora incluye la talla.
function getWhatsAppMessage() {
    const phone = '573012705080'; 
    let message = '¡Hola Caza Estilo! Estoy listo para confirmar mi cotización:\n\n';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        // CRÍTICO: Incluimos la talla en el mensaje
        message += `* ${item.name} (Talla: ${item.size || 'N/A'}) x${item.quantity} ($${itemTotal.toLocaleString('es-CO')} COP)\n`;
    });

    message += `\n*TOTAL ESTIMADO:* $${total.toLocaleString('es-CO')} COP\n\n`;
    message += 'Por favor, confírmenme la disponibilidad, el costo total con envío y el método de pago. ¡Gracias!';

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}


/* --- EVENT LISTENERS Y LÓGICA DE LA PÁGINA --- */

document.addEventListener('DOMContentLoaded', () => {
    // Inicialización del menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
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

    // Inicialización del modal del carrito
    const cartModal = document.getElementById('cart-modal');
    const viewCartButton = document.getElementById('view-cart-button');
    const confirmWhatsappButton = document.getElementById('confirm-whatsapp');

    viewCartButton.addEventListener('click', () => {
        renderCartModal();
        cartModal.style.display = 'flex';
    });

    // Enviar a WhatsApp desde el modal
    confirmWhatsappButton.addEventListener('click', () => {
        if (cart.length > 0) {
            window.open(getWhatsAppMessage(), '_blank');
        } else {
            alert('Tu carrito está vacío. Agrega productos antes de cotizar.');
        }
    });

    // Lógica para que los modales se cierren al hacer clic fuera del contenido
    document.getElementById('cart-modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-modal-overlay')) {
            document.getElementById('cart-modal').style.display = 'none';
        }
    });
    // ¡CRÍTICO! Añadir listener para el nuevo modal de tallas
    document.getElementById('size-modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-modal-overlay')) {
            document.getElementById('size-modal').style.display = 'none';
        }
    });

    // Lógica de Scroll para efectos visuales (se mantiene igual)
    const header = document.querySelector('header');
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
    header.style.opacity = 1; 
});


// Lógica del Loader y carga de productos (se mantiene igual)
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
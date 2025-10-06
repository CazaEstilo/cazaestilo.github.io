// Data de productos (ARRAY DE OBJETOS)
const productsData = [
    {
        id: 1,
        name: "Conjunto Estilo Urbano",
        description: "Comodidad y presencia. Este conjunto de dos piezas te hará destacar sin esfuerzo.",
        price: 180000, // Precio de ejemplo
        images: ["imagenes/conjunto.jpg", "imagenes/conjunto.jpg", "imagenes/conjunto.jpg"],
        soldOut: false
    },
    {
        id: 2,
        name: "Chaqueta Negra Oversize",
        description: "Chaqueta con caída holgada. El toque perfecto para un look imponente y moderno.",
        price: 240000,
        images: ["imagenes/jeanblanco.jpg", "imagenes/jeanblanco.jpg", "imagenes/jeanblanco.jpg"],
        soldOut: false
    },
    {
        id: 3,
        name: "Jean Cargo Streetwear",
        description: "Durabilidad y diseño. Bolsillos laterales que redefinen la silueta casual.",
        price: 155000,
        images: ["imagenes/jeancafe.jpg", "imagenes/jeancafe.jpg", "imagenes/jeancafe.jpg"],
        soldOut: true // Ejemplo de producto agotado
    },
    {
        id: 4,
        name: "Camiseta Gráfica Vintage",
        description: "Algodón premium con diseño exclusivo. Arte callejero para tu día a día.",
        price: 90000,
        images: ["imagenes/producto4-1.jpg", "imagenes/producto4-2.jpg"],
        soldOut: false
    }
];

let cart = JSON.parse(localStorage.getItem('cazaEstiloCart')) || [];

// Función para inicializar los carruseles de imágenes de cada producto
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

// Función para inicializar el carrusel de testimonios
function initializeTestimonialCarousel() {
    new Swiper('.testimonials-carousel', {
        slidesPerView: 1, // Muestra 1 slide en móvil
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000, // Cambia cada 5 segundos
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
            // Cuando la pantalla es de 768px o más, muestra 2 slides
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            // Cuando la pantalla es de 1024px o más, muestra 3 slides
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            }
        }
    });
}

// Función para cargar productos en el DOM
function loadProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = productsData.map(product => {
        const isSoldOut = product.soldOut ? 'sold-out' : '';
        
        // Generar la estructura del carrusel de imágenes
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
                        <button class="btn add-to-cart-btn" onclick="addToCart(${product.id})" ${product.soldOut ? 'disabled' : ''}>
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

    // Inicializar Swipers después de cargar el contenido
    initializeSwipers();
}

// Función para añadir productos al carrito (solo cotización)
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
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

// Función para actualizar el contador del carrito
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Función para renderizar el contenido del modal del carrito
function renderCartModal() {
    const listElement = document.getElementById('cart-items-list');
    const totalElement = document.getElementById('cart-modal-total');
    let total = 0;

    if (cart.length === 0) {
        listElement.innerHTML = '<p>El carrito de cotización está vacío.</p>';
        totalElement.textContent = '$0';
        return;
    }

    const itemsHtml = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item">
                <span class="item-title">${item.name}</span>
                <span class="item-quantity">x${item.quantity}</span>
                <span class="item-price">$${itemTotal.toLocaleString('es-CO')} COP</span>
            </div>
        `;
    }).join('');

    listElement.innerHTML = itemsHtml;
    totalElement.textContent = `$${total.toLocaleString('es-CO')} COP`;
}

// Función para vaciar el carrito
function clearCart() {
    cart = [];
    localStorage.removeItem('cazaEstiloCart');
    updateCartCount();
    renderCartModal();
}

// Función para generar el mensaje de WhatsApp
function getWhatsAppMessage() {
    const phone = '573012705080'; 
    let message = '¡Hola Caza Estilo! Me gustaría cotizar los siguientes productos:\n\n';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `* ${item.name} x${item.quantity} ($${itemTotal.toLocaleString('es-CO')} COP)\n`;
    });

    message += `\n*TOTAL ESTIMADO:* $${total.toLocaleString('es-CO')} COP\n\n`;
    message += 'Por favor, confírmenme la disponibilidad y el costo total con envío. ¡Gracias!';

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
            // Opcional: limpiar el carrito después de enviar
            // clearCart(); 
            // cartModal.style.display = 'none';
        } else {
            alert('Tu carrito está vacío. Agrega productos antes de cotizar.');
        }
    });

    // Lógica para que el modal se cierre al hacer clic fuera del contenido
    cartModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-modal-overlay')) {
            cartModal.style.display = 'none';
        }
    });

    // Lógica de Scroll para efectos visuales
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    const navbar = document.querySelector('.navbar');

    const checkScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight * 0.8;
        
        // Efecto Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Efecto secciones
        sections.forEach(section => {
            if (section.offsetTop < scrollPosition) {
                section.classList.add('visible-section');
            }
        });
    };

    window.addEventListener('scroll', checkScroll);
    
    // Carga inicial del contador y efectos de la cabecera
    updateCartCount();
    header.style.opacity = 1; // Hacer visible el header
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
    initializeTestimonialCarousel(); // Inicializar el carrusel de testimonios

    // 3. Asegurar reproducción de video (necesario por las políticas de navegadores)
    if (headerVideo) {
         headerVideo.play().catch(error => {
             console.log("Autoplay de video bloqueado: ", error);
         });
    }
});
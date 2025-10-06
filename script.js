// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- VARIABLES GLOBALES DEL DOM ---
    const loaderOverlay = document.querySelector('.loader-overlay');
    const header = document.querySelector('header');
    const animatedTexts = document.querySelectorAll('.animated-text');
    const sections = document.querySelectorAll('section');
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const scrollLinks = document.querySelectorAll('.scroll-to-section');
    const headerVideo = document.getElementById('header-video'); 
    const productsContainer = document.getElementById('products-container');

    // --- VARIABLES Y LÓGICA DEL CARRITO DE WHATSAPP (COTZACIÓN) ---
    let cart = JSON.parse(localStorage.getItem('cazaestilo_cart')) || [];
    const cartCountElement = document.getElementById('cart-count');
    const viewCartButton = document.getElementById('view-cart-button');
    const WHATSAPP_NUMBER = '573012705080';

    let cartModal = null; 

    function updateCartCount() {
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    // MODIFICADO: Añadida función de feedback visual
    function triggerCartFeedback() {
        if (viewCartButton) {
            viewCartButton.classList.add('cart-feedback');
            setTimeout(() => {
                viewCartButton.classList.remove('cart-feedback');
            }, 500); // Duración de la animación en CSS
        }
    }

    function addToCart(product) {
        const productId = product.slug; 
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1; 
        } else {
            cart.push({
                id: productId, 
                title: product.title, 
                price: product.price,
                quantity: 1
            }); 
        }
        
        localStorage.setItem('cazaestilo_cart', JSON.stringify(cart));
        updateCartCount();
        triggerCartFeedback(); // Llama a la animación de feedback
        alert(`"${product.title}" añadido al carrito de cotización.`);
    }

    function generateWhatsappMessage() {
        if (cart.length === 0) {
            return null;
        }
        
        let message = "¡Hola Caza Estilo! Estoy interesado(a) en cotizar los siguientes productos:\n\n";
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity; 
            const priceUnitFormatted = item.price.toLocaleString('es-CO');

            message += `* ${item.title} (Cant: ${item.quantity}) - Precio Unit: $${priceUnitFormatted} COP\n`;
            total += itemTotal;
        });

        const totalFormatted = total.toLocaleString('es-CO');
        message += `\nTotal estimado: $${totalFormatted} COP`;
        message += `\n\nPor favor, confírmenme disponibilidad, talla y proceso de pago.`;

        return message;
    }

    function clearCart() {
        if (confirm("¿Estás seguro de que quieres vaciar tu carrito de cotización?")) {
            cart = [];
            localStorage.removeItem('cazaestilo_cart');
            updateCartCount();
            if (cartModal) {
                 cartModal.remove(); 
                 cartModal = null;
            }
            alert("El carrito ha sido vaciado.");
        }
    }

    function viewCart() {
        if (cart.length === 0) {
            alert("Tu carrito de cotización está vacío.");
            return;
        }
        
        if (cartModal) {
            cartModal.remove();
            cartModal = null;
        }

        const cartItemsHTML = cart.map(item => {
            const itemTotal = (item.price * item.quantity).toLocaleString('es-CO');
            const priceUnitFormatted = item.price.toLocaleString('es-CO');
            return `
                <div class="cart-item">
                    <span class="item-title">${item.title}</span>
                    <span class="item-quantity">x ${item.quantity}</span>
                    <span class="item-price">$${itemTotal} COP</span>
                </div>
            `;
        }).join('');

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('es-CO');

        cartModal = document.createElement('div');
        cartModal.classList.add('cart-modal-overlay');
        cartModal.innerHTML = `
            <div class="cart-modal-content">
                <h3>Tu Pedido de Cotización</h3>
                <div class="cart-items-list">
                    ${cartItemsHTML}
                </div>
                <div class="cart-total">
                    <span>Total Estimado:</span>
                    <span class="total-price">$${total} COP</span>
                </div>
                <p class="modal-info">Al confirmar, serás redirigido a WhatsApp con tu pedido listo para enviar.</p>
                <div class="modal-actions">
                    <button id="close-cart-modal" class="btn btn-secondary">Seguir Comprando</button>
                    <button id="clear-cart-btn" class="btn btn-warning">Vaciar Carrito</button>
                    <button id="confirm-whatsapp-btn" class="btn btn-whatsapp-confirm"><i class="fab fa-whatsapp"></i> Confirmar Pedido</button>
                </div>
            </div>
        `;

        document.body.appendChild(cartModal);
        
        document.getElementById('close-cart-modal').addEventListener('click', () => {
            cartModal.remove();
            cartModal = null;
        });
        
        document.getElementById('clear-cart-btn').addEventListener('click', clearCart);

        document.getElementById('confirm-whatsapp-btn').addEventListener('click', () => {
            const message = generateWhatsappMessage();
            if (message) {
                const encodedMessage = encodeURIComponent(message);
                const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
                window.open(whatsappURL, '_blank');
                
                if (cartModal) {
                    cartModal.remove();
                    cartModal = null;
                }
            }
        });

        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.remove();
                cartModal = null;
            }
        });
    }
    
    if (viewCartButton) {
        viewCartButton.addEventListener('click', viewCart);
    }
    updateCartCount();

    // --- LÓGICA CMS Y CARGA DINÁMICA DE PRODUCTOS (SIMULACIÓN) ---
    
    const productDataCache = {}; 
    
    function renderProduct(product) {
        const slug = product.slug;
        const title = product.title || 'Producto Sin Título';
        const price_num = product.price || 0;
        const price = `$${price_num.toLocaleString('es-CO')} COP`;
        
        const stock = product.stock !== undefined ? product.stock : 1;
        const soldOutClass = stock === 0 ? 'sold-out' : '';
        const buttonText = stock > 0 ? 'Añadir al Carrito' : 'Agotado';
        
        const encodedTitle = encodeURIComponent(title);
        const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=%C2%A1Hola!%20Me%20interesa%20el%20${encodedTitle}%20(Precio%3A%20${price}).%20Quiero%20ordenar%20ya%20mismo%20%F0%9F%92%96.`;

        productDataCache[slug] = { ...product, price_formatted: price, whatsapp_link: whatsappLink };
        
        let slidesHTML = product.images.map(img => `
            <div class="swiper-slide">
                <img src="${img.image}" alt="${title}">
            </div>
        `).join('');

        const productHTML = `
            <div class="product ${soldOutClass}">
                <div class="product-carousel swiper-container" data-slug="${slug}">
                    <div class="swiper-wrapper">
                        ${slidesHTML}
                    </div>
                    <div class="swiper-pagination"></div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                </div>
                
                <div class="product-info">
                    <h3>${title}</h3>
                    <p>${product.body}</p> 
                    <div class="product-price-meta">
                        <p class="price-tag">${price}</p>
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn add-to-cart-btn" data-slug="${slug}" ${stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i> ${buttonText}
                        </button>
                        <a href="${whatsappLink}" target="_blank" class="btn btn-whatsapp" ${stock === 0 ? 'style="display:none;"' : ''}>
                             <i class="fab fa-whatsapp"></i> Cazala Ya
                        </a>
                    </div>
                </div>
            </div>
        `;

        if (productsContainer) {
            productsContainer.insertAdjacentHTML('beforeend', productHTML);
        }
    }
    
    // ** SIMULACIÓN DE DATOS DE PRODUCTOS (Mantener data para la demo) **
    async function loadProducts() {
        const productsData = [
            {
                slug: "conjunto-corazon",
                title: "Conjunto Corazón",
                body: "Conjunto de dos piezas con diseño único. Look atrevido y memorable. Tela suave con caída y detalles exclusivos.",
                price: 94900,
                stock: 5,
                quality: 95,
                images: [
                    { image: "conjunto.jpg" }, 
                    { image: "conjunto2.jpg" }, 
                    { image: "conjunto3.jpg" } 
                ],
            },
            {
                slug: "jean-blanco",
                title: "Jean Blanco",
                body: "Jean blanco de corte moderno, ideal para un estilo minimalista y sofisticado. Material resistente con 2% de stretch. Tallas 28-34.",
                price: 110900,
                stock: 3,
                quality: 100,
                images: [
                    { image: "jeanblanco.jpg" },
                    { image: "jeanblanco2.jpg" },
                    { image: "jeanblanco3.jpg" }
                ],
            },
            {
                slug: "saco-exclusivo",
                title: "Saco Exclusivo",
                body: "Saco suave y acogedor, perfecto para días fríos sin sacrificar tu estilo. Pieza de colección. ¡Últimas unidades!",
                price: 105900,
                stock: 0, 
                quality: 100,
                images: [
                    { image: "saco.jpg" },
                    { image: "saco2.jpg" },
                    { image: "saco.jpg" } 
                ],
            }
        ];
        
        productsData.forEach(renderProduct);
        initializeSwipers();
        initializeProductListeners();
    }
    
    function initializeSwipers() {
        document.querySelectorAll('.product-carousel').forEach(carouselEl => {
            new Swiper(carouselEl, {
                loop: true,
                effect: 'fade', 
                fadeEffect: {
                    crossFade: true,
                },
                autoplay: { 
                    delay: 4000,
                    disableOnInteraction: false,
                },
                speed: 800,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                simulateTouch: false,
                touchStartPreventDefault: false,
            });
        });
    }

    function initializeProductListeners() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const slug = button.dataset.slug;
                const product = productDataCache[slug];
                if (product && product.stock > 0) {
                    addToCart({
                        slug: product.slug,
                        title: product.title,
                        price: product.price, 
                        whatsapp_link: product.whatsapp_link
                    });
                }
            });
        });
    }


    // --- LÓGICA DE CARGA Y ANIMACIÓN INICIAL Y SCROLL ---
    function hideLoader() {
        if (loaderOverlay) {
            loaderOverlay.classList.add('hidden');
        }
    }

    function showContent() {
        if (header) {
            header.style.opacity = 1;
        }
        animatedTexts.forEach((text, index) => {
            text.style.animationDelay = `${0.2 * index}s`;
            text.classList.add('show');
        });
    }

    window.addEventListener('load', () => {
        const loaderDuration = 1000; 

        setTimeout(() => {
            hideLoader(); 
            showContent();
        }, loaderDuration);
        
        loadProducts(); 

        if (headerVideo) {
             headerVideo.play().catch(error => {});
        }
    });

    window.addEventListener('scroll', () => {
        // Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Animación de secciones al hacer scroll 
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;
            if (sectionTop < screenHeight - 200) { 
                section.classList.add('visible-section');
            } else {
                section.classList.remove('visible-section');
            }
        });
    });

    // Toggle del Menú
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('click', () => {
                // Cierra el menú móvil al hacer clic en un enlace (excepto el botón de carrito)
                if (!el.classList.contains('btn-cart') && navLinks.classList.contains('active')) { 
                    navLinks.classList.remove('active');
                }
            });
        });
    }
    
    // Smooth Scroll
    scrollLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - (navbar.offsetHeight),
                    behavior: 'smooth'
                });
            }
        });
    });
});
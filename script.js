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

    function updateCartCount() {
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
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
        alert(`"${product.title}" añadido al carrito de cotización.`);
    }

    function viewCart() {
        if (cart.length === 0) {
            alert("Tu carrito de cotización está vacío.");
            return;
        }
        
        let message = "¡Hola Caza Estilo! Estoy interesado(a) en cotizar los siguientes productos:\n\n";
        let total = 0;

        cart.forEach(item => {
            // Asumiendo que price ya es numérico y está en la unidad más pequeña (ej. COP)
            const itemTotal = item.price * item.quantity; 
            const itemTotalFormatted = itemTotal.toLocaleString('es-CO');
            const priceUnitFormatted = item.price.toLocaleString('es-CO');

            message += `* ${item.title} (Cant: ${item.quantity}) - Precio Unit: $${priceUnitFormatted} COP\n`;
            total += itemTotal;
        });

        const totalFormatted = total.toLocaleString('es-CO');
        message += `\nTotal estimado: $${totalFormatted} COP`;
        message += `\n\nPor favor, confírmenme disponibilidad, talla y proceso de pago.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        window.open(whatsappURL, '_blank');
    }
    
    if (viewCartButton) {
        viewCartButton.addEventListener('click', viewCart);
    }
    updateCartCount();

    // --- LÓGICA CMS Y CARGA DINÁMICA DE PRODUCTOS (SIMULACIÓN) ---
    
    const productDataCache = {}; 
    
    // Función para renderizar un producto con su carrusel
    function renderProduct(product) {
        const slug = product.slug;
        const title = product.title || 'Producto Sin Título';
        const price_num = product.price || 0;
        const price = `$${price_num.toLocaleString('es-CO')} COP`;
        const stock = product.stock !== undefined ? product.stock : 1;
        const quality = product.quality !== undefined ? product.quality : 100;
        
        const soldOutClass = stock === 0 ? 'sold-out' : '';
        const stockText = stock > 0 ? `Stock: ${stock} unid.` : '¡AGOTADO!';
        const buttonText = stock > 0 ? 'Añadir al Carrito' : 'Agotado';
        
        const encodedTitle = encodeURIComponent(title);
        const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=%C2%A1Hola!%20Me%20interesa%20el%20${encodedTitle}%20(Precio%3A%20${price}).%20Quiero%20ordenar%20ya%20mismo%20%F0%9F%92%96.`;

        // Guardar la data completa en caché
        productDataCache[slug] = { ...product, price_formatted: price, whatsapp_link: whatsappLink };
        
        // Generar slides del carrusel
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
                        <div class="product-meta">
                            <div class="stock-info">${stockText}</div>
                            <div class="quality-info">Calidad: ${quality}%</div>
                        </div>
                    </div>
                    <button class="btn btn-small add-to-cart-btn" data-slug="${slug}" ${stock === 0 ? 'disabled' : ''}>
                        ${buttonText}
                    </button>
                    <a href="${whatsappLink}" target="_blank" class="btn btn-small btn-whatsapp" ${stock === 0 ? 'style="display:none;"' : ''}>
                         <i class="fab fa-whatsapp"></i> Cazala aqui
                    </a>
                </div>
            </div>
        `;

        if (productsContainer) {
            productsContainer.insertAdjacentHTML('beforeend', productHTML);
        }
    }
    
    // ** SIMULACIÓN DE DATOS DE PRODUCTOS (¡Ajusta tus datos y las imágenes!) **
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
                stock: 0, // Agotado
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
    
    // --- LÓGICA DE INICIALIZACIÓN DE SWIPERS EN CADA PRODUCTO ---
    function initializeSwipers() {
        document.querySelectorAll('.product-carousel').forEach(carouselEl => {
            new Swiper(carouselEl, {
                loop: true,
                effect: 'fade', 
                fadeEffect: {
                    crossFade: true,
                },
                autoplay: { // CRÍTICO: Transición automática
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
                // Deshabilitar la navegación en dispositivos táctiles si es necesario
                simulateTouch: false,
                touchStartPreventDefault: false,
            });
        });
    }

    function initializeProductListeners() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        
        // Listeners para AÑADIR AL CARRITO
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const slug = button.dataset.slug;
                const product = productDataCache[slug];
                if (product && product.stock > 0) {
                    // El campo 'price' es numérico en la caché
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
             // Intenta reproducir el video, ignorando errores de autoplay
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

        // Animación de secciones al hacer scroll (Mejora la detección)
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;
            if (sectionTop < screenHeight - 200) { // Se activa antes
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
                if (!el.classList.contains('btn-cart')) { 
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
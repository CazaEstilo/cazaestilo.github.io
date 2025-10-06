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
    const headerVideo = document.getElementById('header-video'); // Video del Header
    
    // --- VARIABLES DEL MODAL Y CARRUSEL ---
    const modal = document.getElementById('image-modal');
    const modalSwiperWrapper = document.getElementById('modal-swiper-wrapper');
    const modalTitle = document.querySelector('.modal-title');
    const modalPrice = document.querySelector('.modal-price');
    const modalDescription = document.querySelector('.modal-description');
    const modalWhatsappLink = document.getElementById('modal-whatsapp-link');
    const modalAddToCartButton = document.getElementById('modal-add-to-cart'); 
    const closeButton = document.querySelector('.close-button');
    let productDataCache = {}; 
    let currentProductSlug = null; 

    // --- VARIABLES Y LÓGICA DEL CARRITO DE WHATSAPP ---
    let cart = JSON.parse(localStorage.getItem('cazaestilo_cart')) || [];
    const cartCountElement = document.getElementById('cart-count');
    const viewCartButton = document.getElementById('view-cart-button');
    const WHATSAPP_NUMBER = '573012705080'; // <-- ¡IMPORTANTE: REEMPLAZA CON TU NÚMERO!

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
        alert(`"${product.title}" ha sido agregado al carrito.`);
    }

    function viewCart() {
        if (cart.length === 0) {
            alert("Tu carrito de cotización está vacío.");
            return;
        }
        
        let message = "¡Hola Caza Estilo! Estoy interesado(a) en cotizar los siguientes productos:\n\n";
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const itemTotalFormatted = itemTotal.toLocaleString('es-CO');
            
            message += `* ${item.title} (Cant: ${item.quantity}) - Total: $${itemTotalFormatted} COP\n`;
            total += itemTotal;
        });

        const totalFormatted = total.toLocaleString('es-CO');
        message += `\nTotal estimado: $${totalFormatted} COP`;
        message += `\n\nPor favor, confírmenme disponibilidad y proceso de pago.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        window.open(whatsappURL, '_blank');
    }
    
    if (viewCartButton) {
        viewCartButton.addEventListener('click', viewCart);
    }
    updateCartCount();

    if (modalAddToCartButton) {
        modalAddToCartButton.addEventListener('click', () => {
            if (currentProductSlug && productDataCache[currentProductSlug]) {
                const product = productDataCache[currentProductSlug];
                if (product.stock > 0) {
                    addToCart(product);
                    modal.classList.remove('open');
                } else {
                    alert("Este producto está agotado y no puede añadirse al carrito.");
                }
            }
        });
    }


    // --- LÓGICA CMS Y CARGA DINÁMICA DE PRODUCTOS ---
    
    function renderProduct(product) {
        const slug = product.slug;
        const title = product.title || 'Producto Sin Título';
        const price_num = product.price || 0;
        const price = `$${price_num.toLocaleString('es-CO')} COP`;
        const stock = product.stock !== undefined ? product.stock : 1;
        const quality = product.quality !== undefined ? product.quality : 100;
        
        const firstImgSrc = product.images && product.images.length > 0 ? product.images[0].image : 'default.jpg'; 
        
        const soldOutClass = stock === 0 ? 'sold-out' : '';
        const stockText = stock > 0 ? `Stock: ${stock} unid.` : '¡AGOTADO!';
        const buttonText = stock > 0 ? 'Añadir al Carrito' : 'Agotado';
        
        const encodedTitle = encodeURIComponent(title);
        const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=%C2%A1Hola!%20Me%20interesa%20el%20${encodedTitle}%20(Precio%3A%20${price}).%20Quiero%20ordenar%20ya%20mismo%20%F0%9F%92%96.`;

        productDataCache[slug] = { ...product, price_formatted: price, whatsapp_link: whatsappLink };
        
        const productHTML = `
            <div class="product ${soldOutClass}">
                <a href="#" class="open-modal-link" data-slug="${slug}">
                    <img src="${firstImgSrc}" alt="${title}">
                </a>
                <div class="product-info">
                    <h3>${title}</h3>
                    <p>${price}</p>
                    <div class="product-meta">
                        <div class="stock-info">${stockText}</div>
                        <div class="quality-info">Calidad: ${quality}%</div>
                    </div>
                    <button class="btn btn-small add-to-cart-btn" data-slug="${slug}" ${stock === 0 ? 'disabled' : ''}>
                        ${buttonText}
                    </button>
                    <a href="${whatsappLink}" target="_blank" class="btn btn-small" ${stock === 0 ? 'style="display:none;"' : ''}>
                         Cazala aqui
                    </a>
                </div>
            </div>
        `;

        const productsContainer = document.getElementById('products-container');
        if (productsContainer) {
            productsContainer.insertAdjacentHTML('beforeend', productHTML);
        }
    }
    
    // Función para cargar los datos (SIMULACIÓN DE JSON)
    async function loadProducts() {
        // *** CAMBIA ESTOS DATOS POR TUS PRODUCTOS REALES ***
        const productsData = [
            {
                slug: "conjunto-corazon",
                title: "Conjunto Corazón",
                body: "Un conjunto de dos piezas con un diseño único, perfecto para quienes buscan un look atrevido y memorable. Tela suave con caída y detalles exclusivos.",
                price: 94900,
                stock: 5,
                quality: 95,
                images: [{ image: "conjunto.jpg" }, { image: "conjunto2.jpg" }, { image: "conjunto3.jpg" }],
            },
            {
                slug: "jean-blanco",
                title: "Jean Blanco",
                body: "Un jean blanco de corte moderno, ideal para combinar con cualquier prenda y crear un estilo minimalista y sofisticado. Material resistente con 2% de stretch. Tallas 28-34.",
                price: 110900,
                stock: 3,
                quality: 100,
                images: [{ image: "jeanblanco.jpg" }, { image: "jeanblanco2.jpg" }, { image: "jeanblanco3.jpg" }],
            },
            {
                slug: "saco-exclusivo",
                title: "Saco Exclusivo",
                body: "Un saco suave y acogedor, ideal para los días fríos sin sacrificar tu estilo. Últimas unidades, pieza de colección.",
                price: 105900,
                stock: 0, 
                quality: 100,
                images: [{ image: "saco.jpg" }, { image: "saco2.jpg" }],
            }
        ];
        
        productsData.forEach(renderProduct);
        initializeProductListeners();
    }
    
    function initializeSwiper(images) {
        modalSwiperWrapper.innerHTML = ''; 

        images.forEach(img => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            slide.innerHTML = `<img src="${img.image}" alt="${modalTitle.textContent}">`;
            modalSwiperWrapper.appendChild(slide);
        });

        if (modal.swiperInstance) {
            modal.swiperInstance.destroy(true, true);
        }

        modal.swiperInstance = new Swiper('.modal-swiper', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'fade', 
            fadeEffect: {
                crossFade: true,
            },
            speed: 500,
        });
    }

    function initializeProductListeners() {
        const openModalLinks = document.querySelectorAll('.open-modal-link');
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        
        // 1. Listeners para ABRIR MODAL
        openModalLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); 
                
                const slug = link.dataset.slug;
                const product = productDataCache[slug];
                currentProductSlug = slug; 

                if (product) {
                    modalTitle.textContent = product.title;
                    modalPrice.textContent = product.price_formatted;
                    modalDescription.innerHTML = product.body.replace(/\n/g, '<br>'); 
                    modalWhatsappLink.href = product.whatsapp_link;
                    
                    const isAvailable = product.stock > 0;
                    modalAddToCartButton.disabled = !isAvailable;
                    modalAddToCartButton.textContent = isAvailable ? 'Añadir al Carrito' : 'Agotado';
                    modalWhatsappLink.style.display = isAvailable ? 'block' : 'none'; 
                    
                    initializeSwiper(product.images);
                    modal.classList.add('open');
                }
            });
        });

        // 2. Listeners para AÑADIR AL CARRITO desde la vista de lista
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const slug = button.dataset.slug;
                const product = productDataCache[slug];
                if (product && product.stock > 0) {
                    addToCart(product);
                }
            });
        });
    }


    // --- LÓGICA DE CARGA Y ANIMACIÓN INICIAL ---
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
        // Ocultar el loader tras 1 segundo para ver el video
        const loaderDuration = 1000; 

        setTimeout(() => {
            hideLoader(); 
            showContent();
        }, loaderDuration);
        
        loadProducts(); 

        if (headerVideo) {
             headerVideo.play().catch(error => {
                 console.warn("Autoplay de video del header falló:", error);
            });
        }
    });


    // --- Funcionalidades de navegación, scroll y modal ---
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;
            if (sectionTop < screenHeight - 150) {
                section.classList.remove('hidden-section');
                section.classList.add('visible-section');
            }
        });
    });

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

    closeButton.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('open');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            modal.classList.remove('open');
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {

    // --- Variables del DOM ---
    const loaderOverlay = document.querySelector('.loader-overlay');
    const header = document.querySelector('header');
    const animatedTexts = document.querySelectorAll('.animated-text');
    const sections = document.querySelectorAll('section');
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const scrollLinks = document.querySelectorAll('.scroll-to-section');
    const logoVideo = document.getElementById('logo-video'); 
    
    // --- Variables del Modal ---
    const modal = document.getElementById('image-modal');
    const modalSwiperWrapper = document.getElementById('modal-swiper-wrapper'); // NUEVO
    const modalTitle = document.querySelector('.modal-title');
    const modalPrice = document.querySelector('.modal-price');
    const modalDescription = document.querySelector('.modal-description');
    const modalWhatsappLink = document.getElementById('modal-whatsapp-link'); // NUEVO
    const closeButton = document.querySelector('.close-button');
    let productDataCache = {}; // Cache para guardar los datos del producto (necesario para el modal)
    
    
    // --- LÓGICA CMS Y CARGA DINÁMICA DE PRODUCTOS ---
    
    // Función para renderizar un producto en el DOM
    function renderProduct(product) {
        // Asegura que los campos importantes no sean nulos
        const slug = product.slug; // Usamos el slug como ID único
        const title = product.title || 'Producto Sin Título';
        const price = product.price ? `$${product.price.toLocaleString('es-CO')} COP` : 'Precio no disponible';
        const stock = product.stock !== undefined ? product.stock : 1;
        const quality = product.quality !== undefined ? product.quality : 100;
        
        // Obtenemos la primera imagen para el thumbnail
        const firstImgSrc = product.images && product.images.length > 0 ? product.images[0].image : 'default.jpg'; 
        
        // Determina si está agotado
        const soldOutClass = stock === 0 ? 'sold-out' : '';
        const stockText = stock > 0 ? `Stock: ${stock} unid.` : '¡AGOTADO!';
        const buttonText = stock > 0 ? 'Cazala aqui' : 'Avísame';
        
        // Enlace de WhatsApp generado con el título y precio actualizados
        const encodedTitle = encodeURIComponent(title);
        const encodedPrice = encodeURIComponent(price);
        const whatsappLink = `https://wa.me/573012705080?text=%C2%A1Hola!%20Me%20interesa%20el%20${encodedTitle}.%20Precio%3A%20${encodedPrice}.%20Quiero%20ordenar%20ya%20mismo%20%F0%9F%92%96.`;

        // Guardamos la data completa en caché usando el slug como clave
        productDataCache[slug] = { ...product, price_formatted: price, whatsapp_link: whatsappLink };
        
        // Plantilla HTML del producto
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
                    <a href="${whatsappLink}" target="_blank" class="btn btn-small">${buttonText}</a>
                </div>
            </div>
        `;

        document.getElementById('products-container').insertAdjacentHTML('beforeend', productHTML);
    }
    
    // Función para cargar los datos (SIMULACIÓN DE CMS)
    async function loadProducts() {
        // *** IMPORTANTE: RECUERDA REEMPLAZAR ESTE ARRAY DE PRUEBA ***
        // Para una integración real, usarías un script que convierta los archivos
        // de la carpeta `_productos` a un único JSON para leer con 'fetch'.
        const productsData = [
            {
                slug: "conjunto-corazon",
                title: "Conjunto Corazón",
                body: "Un conjunto de dos piezas con un diseño único, perfecto para quienes buscan un look atrevido y memorable. Tela suave con caída.",
                price: 94900,
                stock: 1,
                quality: 95,
                images: [{ image: "conjunto.jpg" }, { image: "conjunto2.jpg" }, { image: "conjunto3.jpg" }], // Añade más imágenes de prueba
            },
            {
                slug: "jean-blanco",
                title: "Jean Blanco",
                body: "Un jean blanco de corte moderno, ideal para combinar con cualquier prenda y crear un estilo minimalista y sofisticado. Tallas 28-34.",
                price: 110900,
                stock: 1,
                quality: 100,
                images: [{ image: "jeanblanco.jpg" }, { image: "jeanblanco2.jpg" }],
            },
            {
                slug: "saco-exclusivo",
                title: "Saco Exclusivo",
                body: "Un saco suave y acogedor, ideal para los días fríos sin sacrificar tu estilo. Próximamente.",
                price: 105900,
                stock: 0, // Stock 0 para "Agotado"
                quality: 100,
                images: [{ image: "saco.jpg" }],
            }
        ];
        
        // Renderiza cada producto
        productsData.forEach(renderProduct);
        
        // Inicializa la lógica del modal para los productos recién insertados
        initializeModalListeners();
    }
    
    // Función para inicializar y gestionar el Carrusel (Swiper)
    function initializeSwiper(images) {
        // Limpiamos el carrusel antes de añadir nuevas imágenes
        modalSwiperWrapper.innerHTML = ''; 

        images.forEach(img => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            slide.innerHTML = `<img src="${img.image}" alt="${modalTitle.textContent}">`;
            modalSwiperWrapper.appendChild(slide);
        });

        // Destruye la instancia previa de Swiper si existe
        if (modal.swiperInstance) {
            modal.swiperInstance.destroy(true, true);
        }

        // Inicializa Swiper
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
            effect: 'fade', // Efecto de transición (o 'slide')
            fadeEffect: {
                crossFade: true,
            },
        });
    }

    // Inicializa listeners para abrir el modal (ahora funciona con productos dinámicos)
    function initializeModalListeners() {
        const newOpenModalLinks = document.querySelectorAll('.open-modal-link');
        
        newOpenModalLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); 
                
                const slug = link.dataset.slug;
                const product = productDataCache[slug];

                if (product) {
                    // Rellenar el modal con la información
                    modalTitle.textContent = product.title;
                    modalPrice.textContent = product.price_formatted;
                    modalDescription.innerHTML = product.body;
                    modalWhatsappLink.href = product.whatsapp_link;
                    
                    // Inicializar el carrusel con las imágenes del producto
                    initializeSwiper(product.images);

                    // Mostrar el modal
                    modal.classList.add('open');
                }
            });
        });
    }


    // --- Funcionalidad 1: Loader de Carga y Animaciones Iniciales ---
    function hideLoader() {
        if (loaderOverlay) {
            if (logoVideo) logoVideo.pause(); 
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
        // Tiempo de carga para el video
        let delayTime = 800;
        if (logoVideo) {
            logoVideo.currentTime = 0; 
            delayTime = 2500; // 2.5 segundos de video
        }
        
        setTimeout(() => {
             hideLoader();
             showContent();
        }, delayTime);
        
        loadProducts(); // Carga los productos dinámicamente
    });

    // --- Funcionalidad 2, 3, 4 (Scroll, Menu, SmoothScroll) quedan iguales
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

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
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

    // --- Lógica para cerrar el modal ---
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
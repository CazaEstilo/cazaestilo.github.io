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
    
    // --- Variables del Modal ---
    const modal = document.getElementById('image-modal');
    const modalImage = document.querySelector('.modal-image');
    const modalTitle = document.querySelector('.modal-title');
    const modalPrice = document.querySelector('.modal-price');
    const modalDescription = document.querySelector('.modal-description');
    const closeButton = document.querySelector('.close-button');
    const openModalLinks = document.querySelectorAll('.open-modal-link');

    // --- Funcionalidad 1: Loader de Carga y Animaciones Iniciales ---
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
        hideLoader();
        setTimeout(showContent, 800); // Pequeño retraso para la animación
    });

    // --- Funcionalidad 2: Detección de Scroll para la Navbar y Secciones ---
    window.addEventListener('scroll', () => {
        // Efecto para la Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Animación al hacer scroll de las secciones
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;

            if (sectionTop < screenHeight - 150) {
                section.classList.remove('hidden-section');
                section.classList.add('visible-section');
            }
        });
    });

    // --- Funcionalidad 3: Toggle del Menú en Móviles ---
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Ocultar menú al hacer clic en un enlace (móviles)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
    
    // --- Funcionalidad 4: Smooth Scroll ---
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

    // --- Funcionalidad 5: Lógica del Modal (NUEVA) ---
    openModalLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Previene el comportamiento por defecto del enlace
            
            // Obtener los datos del producto desde los atributos 'data-'
            const imgSrc = link.dataset.imgSrc;
            const title = link.dataset.title;
            const price = link.dataset.price;
            const description = link.dataset.description;

            // Rellenar el modal con la información
            modalImage.src = imgSrc;
            modalTitle.textContent = title;
            modalPrice.textContent = price;
            modalDescription.textContent = description;

            // Mostrar el modal
            modal.classList.add('open');
        });
    });

    // --- Lógica para cerrar el modal ---
    closeButton.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    // Cerrar el modal haciendo clic fuera de la imagen
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('open');
        }
    });

    // Cerrar el modal con la tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            modal.classList.remove('open');
        }
    });
});
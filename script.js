document.addEventListener('DOMContentLoaded', () => {
    // --- Loader y Animación inicial del Header ---
    const loaderOverlay = document.querySelector('.loader-overlay');
    const header = document.querySelector('header');
    const headerElements = [
        document.querySelector('header h1'),
        document.querySelector('header p'),
        document.querySelector('header .btn')
    ];

    setTimeout(() => {
        loaderOverlay.classList.add('hidden'); // Oculta el overlay
        
        // Muestra el header completo con una transición
        header.style.opacity = '1';

        // Aplica las animaciones a los elementos del header con retraso secuencial
        setTimeout(() => {
            if (headerElements[0]) headerElements[0].classList.add('animated-text', 'show');
        }, 100); 

        setTimeout(() => {
            if (headerElements[1]) headerElements[1].classList.add('animated-text', 'show');
        }, 600); 

        setTimeout(() => {
            if (headerElements[2]) headerElements[2].classList.add('animated-text', 'show');
        }, 1100); 

    }, 1000); // 1 segundo de duración del loader, luego el fade out del loader


    // --- Smooth Scroll para enlaces de navegación ---
    const scrollLinks = document.querySelectorAll('.scroll-to-section');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); 
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop;
                // Ajusta el scroll para tener en cuenta la altura de la barra de navegación
                const navbarHeight = document.querySelector('.navbar').offsetHeight; 
                window.scrollTo({
                    top: offsetTop - navbarHeight - 20, // 20px de padding adicional
                    behavior: 'smooth'
                });

                // Cierra el menú hamburguesa si está abierto
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    document.querySelector('.menu-toggle').querySelector('i').classList.replace('fa-times', 'fa-bars');
                }
            }
        });
    });

    // --- Animación de secciones al hacer scroll (Intersection Observer) ---
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1 // La sección se considera visible cuando el 10% de ella está en el viewport
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible-section');
                entry.target.classList.remove('hidden-section'); 
                // observer.unobserve(entry.target); // Descomentar si solo quieres que se anime una vez
            } else {
                // Si quieres que la animación se reinicie cada vez que la sección sale de la vista
                entry.target.classList.remove('visible-section');
                entry.target.classList.add('hidden-section');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Menú Hamburguesa para Móviles ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times'); // Cambia a X
        } else {
            icon.classList.replace('fa-times', 'fa-bars'); // Vuelve a las barras
        }
    });

    // --- Cambiar estilo de la navbar al hacer scroll ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Cuando el usuario ha hecho scroll 50px
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

});
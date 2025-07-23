document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll para enlaces con la clase 'scroll-to-section'
    const scrollLinks = document.querySelectorAll('.scroll-to-section');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Previene el comportamiento de ancla predeterminado
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animación de secciones al hacer scroll (Intersection Observer)
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // El viewport es el elemento raíz
        rootMargin: '0px',
        threshold: 0.1 // La sección se considera visible cuando el 10% de ella está en el viewport
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible-section');
                entry.target.classList.remove('hidden-section'); // Asegura que la clase oculta se elimine
                // observer.unobserve(entry.target); // Opcional: para que la animación solo ocurra una vez
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

    // Asegurar que el header siempre esté visible al cargar
    const header = document.querySelector('header');
    if (header) {
        header.classList.add('fade-in'); // Asegura que la animación del header se dispare
    }
});

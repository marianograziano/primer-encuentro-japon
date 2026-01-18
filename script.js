// ===== NAVEGACIÓN =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');

// Scroll effect para navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Toggle menú móvil
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ===== MAPA INTERACTIVO ZEN (ESPAÑOL) =====
const map = L.map('map', {
    center: [36.2048, 138.2529],
    zoom: 6,
    scrollWheelZoom: false,
    zoomControl: false
});

// Capa de mapa minimalista
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Capa para el marcador único del día
let markerLayer = L.layerGroup().addTo(map);

function updateMapForDay(lat, lng, title, dayNumber) {
    // Limpiar marcador anterior
    markerLayer.clearLayers();

    // Icono Zen Personalizado
    const zenIcon = L.divIcon({
        className: 'zen-marker',
        html: `<div class="marker-disk"><span>${dayNumber}</span></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // Añadir el marcador
    const marker = L.marker([lat, lng], { icon: zenIcon }).addTo(markerLayer);

    // Popup minimalista en español
    marker.bindPopup(`
        <div class="zen-popup">
            <span class="popup-day">Día ${dayNumber}</span>
            <h4 class="popup-title">${title}</h4>
        </div>
    `, { closeButton: false, offset: [0, -10] }).openPopup();

    // Centrar con suavidad
    map.flyTo([lat, lng], 13, {
        animate: true,
        duration: 1.5
    });
}

// ===== ITINERARIO INTERACTIVO (ACCORDEÓN + MAPA) =====
const accordionItems = document.querySelectorAll('.timeline-accordion-item');

accordionItems.forEach(item => {
    item.addEventListener('click', () => {
        const lat = parseFloat(item.getAttribute('data-lat'));
        const lng = parseFloat(item.getAttribute('data-lng'));
        const dayNumber = item.querySelector('.day-number').innerText;
        const titleText = item.querySelector('h3').innerText;
        const isActive = item.classList.contains('active');

        // Cerrar otros
        accordionItems.forEach(otherItem => otherItem.classList.remove('active'));

        if (!isActive) {
            item.classList.add('active');
            updateMapForDay(lat, lng, titleText, dayNumber);
        } else {
            // Si se cierra, vista general de Japón
            markerLayer.clearLayers();
            map.flyTo([36.2048, 138.2529], 6, {
                animate: true,
                duration: 1.5
            });
        }
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ANIMACIONES AL SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.tematica-card, .timeline-accordion-item, .feature-card, .zen-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Inicializar con el Día 1 activo
window.addEventListener('load', () => {
    setTimeout(() => {
        if (accordionItems.length > 0) accordionItems[0].click();
    }, 1000);
});

console.log('🗾 Propuesta Japón - UX Mejorada');

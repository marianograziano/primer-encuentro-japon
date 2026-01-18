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

// SVG Constants
const ICONS = {
    city: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 2H15C14.45 2 14 2.45 14 3V6H10V3C10 2.45 9.55 2 9 2H5C4.45 2 4 2.45 4 3V21H20V3C20 2.45 19.55 2 19 2ZM8 19H6V17H8V19ZM8 15H6V13H8V15ZM8 11H6V9H8V11ZM8 7H6V5H8V7ZM18 19H16V17H18V19ZM18 15H16V13H18V15ZM18 11H16V9H18V11ZM18 7H16V5H18V7Z"/></svg>`,
    temple: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 19V21H22V19H17V13H19V11H17L15 4H18V2H6V4H9L7 11H5V13H7V19H2ZM9 13H15V19H9V13Z"/></svg>`,
    nature: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 6L10.25 11H13V17L17 10H14.5L14 6ZM4 18H20V20H4V18ZM2 22H22V24H2V22ZM13.5 2L18.5 9H15.5L19 14H15V22H9V14H5L8.5 9H5.5L10.5 2H13.5Z"/></svg>`,
    food: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7V9H5V2H3V9C3 11.12 4.66 12.84 6.75 12.97V22H9.25V12.97C11.34 12.84 13 11.12 13 9V2H11V9ZM16 6V14H18.5V22H21V2C18.24 2 16 4.24 16 6Z"/></svg>`,
    culture: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/></svg>`,
    default: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/></svg>`
};

function updateMapForDay(lat, lng, title, dayNumber, locationType, zoomLevel = 13) {
    // Limpiar marcador anterior
    markerLayer.clearLayers();

    // Determine Icon SVG
    let svgIcon = ICONS.default;
    if (ICONS[locationType]) svgIcon = ICONS[locationType];
    else if (['tokio', 'osaka'].includes(locationType)) svgIcon = ICONS.city;
    else if (['kioto', 'nara', 'kamakura'].includes(locationType)) svgIcon = ICONS.temple;
    else if (['fuji'].includes(locationType)) svgIcon = ICONS.nature;

    // Custom styling
    let extraClass = locationType;

    // Icono Zen Personalizado
    const zenIcon = L.divIcon({
        className: 'zen-marker',
        html: `<div class="marker-disk custom-icon ${extraClass}">${svgIcon}</div>`,
        iconSize: [50, 50],
        iconAnchor: [25, 25]
    });

    // Añadir el marcador
    const marker = L.marker([lat, lng], { icon: zenIcon }).addTo(markerLayer);

    // Popup minimalista
    marker.bindPopup(`
        <div class="zen-popup">
            <span class="popup-day">${dayNumber.includes('Día') ? dayNumber : 'Día ' + dayNumber}</span>
            <h4 class="popup-title">${title}</h4>
        </div>
    `, { closeButton: false, offset: [0, -20] }).openPopup();

    // Centrar con suavidad
    map.flyTo([lat, lng], zoomLevel, {
        animate: true,
        duration: 1.0
    });
}

// ===== ITINERARIO INTERACTIVO (ACCORDEÓN + MAPA) =====
const accordionItems = document.querySelectorAll('.timeline-accordion-item');

accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');

    // Click en el header del día
    header.addEventListener('click', (e) => {
        e.stopPropagation();

        const lat = parseFloat(item.getAttribute('data-lat'));
        const lng = parseFloat(item.getAttribute('data-lng'));
        const dayNumber = item.querySelector('.day-number').innerText;
        const titleText = item.querySelector('h3').innerText;
        const locationType = item.getAttribute('data-location');
        const isActive = item.classList.contains('active');

        // Cerrar otros
        accordionItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        if (!isActive) {
            item.classList.add('active');
            updateMapForDay(lat, lng, titleText, dayNumber, locationType, 13);
        } else {
            item.classList.remove('active');
            markerLayer.clearLayers();
            map.flyTo([36.2048, 138.2529], 6, {
                animate: true,
                duration: 1.5
            });
        }
    });

    // Click en los items de la lista (Actividades específicas)
    const listItems = item.querySelectorAll('li[data-lat]');
    listItems.forEach(li => {
        li.addEventListener('click', (e) => {
            e.stopPropagation(); // IMPORTANTE: No cerrar el acordeón

            const lat = parseFloat(li.getAttribute('data-lat'));
            const lng = parseFloat(li.getAttribute('data-lng'));
            const title = li.getAttribute('data-title');
            const type = li.getAttribute('data-type') || 'default';
            const dayText = item.querySelector('.day-number').innerText;

            // Visual feedback
            item.querySelectorAll('li').forEach(l => {
                l.style.fontWeight = 'normal';
                l.style.color = 'var(--color-dark)';
            });
            li.style.fontWeight = '700';
            li.style.color = 'var(--color-primary)';

            updateMapForDay(lat, lng, title, `Día ${dayText}`, type, 15); // Zoom 15 para la actividad
        });
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
        if (accordionItems.length > 0) {
            // Simular click en el header para abrir el primer día correctamente
            const header = accordionItems[0].querySelector('.accordion-header');
            if (header) header.click();
        }
    }, 1000);
});

console.log('🗾 Propuesta Japón - UX Interactiva');

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

// Capa para el marcador único del día
let markerLayer = L.layerGroup().addTo(map);

// CartoDB Positron (Cleaner, less intense)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// SVG Constants
const ICONS = {
    city: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 2H15C14.45 2 14 2.45 14 3V6H10V3C10 2.45 9.55 2 9 2H5C4.45 2 4 2.45 4 3V21H20V3C20 2.45 19.55 2 19 2ZM8 19H6V17H8V19ZM8 15H6V13H8V15ZM8 11H6V9H8V11ZM8 7H6V5H8V7ZM18 19H16V17H18V19ZM18 15H16V13H18V15ZM18 11H16V9H18V11ZM18 7H16V5H18V7Z"/></svg>`,
    temple: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 19V21H22V19H17V13H19V11H17L15 4H18V2H6V4H9L7 11H5V13H7V19H2ZM9 13H15V19H9V13Z"/></svg>`,
    nature: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 6L10.25 11H13V17L17 10H14.5L14 6ZM4 18H20V20H4V18ZM2 22H22V24H2V22ZM13.5 2L18.5 9H15.5L19 14H15V22H9V14H5L8.5 9H5.5L10.5 2H13.5Z"/></svg>`,
    food: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7V9H5V2H3V9C3 11.12 4.66 12.84 6.75 12.97V22H9.25V12.97C11.34 12.84 13 11.12 13 9V2H11V9ZM16 6V14H18.5V22H21V2C18.24 2 16 4.24 16 6Z"/></svg>`,
    culture: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/></svg>`,
    default: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/></svg>`
};

function updateMapForDay(lat, lng, title, dayNumber, locationType, zoomLevel = 12) { // Zoom reduced to 12
    // Limpiar marcador anterior
    markerLayer.clearLayers();

    // Determine Icon SVG
    let svgIcon = ICONS.default;
    if (ICONS[locationType]) svgIcon = ICONS[locationType];
    else if (['tokio', 'osaka'].includes(locationType)) svgIcon = ICONS.city;
    else if (['kioto', 'nara', 'kamakura', 'himeji', 'hiroshima'].includes(locationType)) svgIcon = ICONS.temple;
    else if (['fuji', 'hakone'].includes(locationType)) svgIcon = ICONS.nature;

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

    // Centrar con suavidad (Less intense animation)
    map.flyTo([lat, lng], zoomLevel, {
        animate: true,
        duration: 2.5, // Slower duration
        easeLinearity: 0.25
    });
}

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

// ===== ANIMACIONES AL SCROLL (Observer) =====
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

document.querySelectorAll('.tematica-card, .feature-card, .zen-card').forEach(el => {
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

// ===== CARGA DINÁMICA DE ITINERARIO VIA JSON =====
fetch('itinerary.json')
    .then(response => response.json())
    .then(data => {
        const container = document.querySelector('.itinerario-timeline-accordion');
        container.innerHTML = ''; // Asegurar contenedor limpio

        data.forEach((day, index) => {
            const item = document.createElement('div');
            item.className = 'timeline-accordion-item';

            // Set styles for animation
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);

            // Generar lista de actividades
            const icons = {
                transport: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="7" cy="15" r="2"/><circle cx="17" cy="15" r="2"/><rect x="11" y="5" width="2" height="5"/></svg>', // Bus/Train generic
                food: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>', // Utensils
                temple: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16"/><path d="M9.5 22v-9.5"/><path d="M14.5 22v-9.5"/><path d="M2 12.5h20"/><path d="M12 2l8 8.5h-3.5v2h-9v-2H4L12 2Z"/></svg>', // Temple-ish
                walking: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/><path d="M12 19v-4"/><path d="M12 9V5"/><path d="M5 12H9"/><path d="M15 12h4"/></svg>', // Sightseeing/Target
                hotel: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>', // Bed/Hotel
                culture: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>' // Check/General
            };

            const activitiesList = day.activities.map(act => {
                let text = act;
                let type = 'culture';
                let included = null;

                if (typeof act === 'object') {
                    text = act.text;
                    type = act.type || 'culture';
                    included = act.included;
                } else {
                    // Fallback heuristics for legacy strings
                    const lower = act.toLowerCase();
                    if (lower.includes('cena') || lower.includes('almuerzo')) type = 'food';
                    else if (lower.includes('traslado') || lower.includes('tren') || lower.includes('llegada')) type = 'transport';
                    else if (lower.includes('templo') || lower.includes('santuario') || lower.includes('castillo')) type = 'temple';
                    else if (lower.includes('hotel') || lower.includes('descanso')) type = 'hotel';
                    else if (lower.includes('paseo') || lower.includes('caminata') || lower.includes('visita')) type = 'walking';
                }

                const iconSvg = icons[type] || icons.culture;

                let badgeHtml = '';
                if (included === true) badgeHtml = '<span class="badge included">Incluido</span>';
                // else if (included === false) badgeHtml = '<span class="badge free">No incluido</span>'; // Hidden per user request

                return `
                    <li class="activity-item">
                        <div class="activity-icon-wrapper ${type}">
                            ${iconSvg}
                        </div>
                        <div class="activity-text-content">
                            <div>${text}</div>
                            ${badgeHtml}
                        </div>
                    </li>
                `;
            }).join('');

            item.innerHTML = `
                <div class="accordion-header">
                    <span class="day-number">${day.day}</span>
                    <div class="header-info">
                        <h3>${day.title}</h3>
                        <p>${day.subtitle}</p>
                    </div>
                    <span class="accordion-icon">⌄</span>
                </div>
                <div class="accordion-content">
                    <ul>${activitiesList}</ul>
                </div>
            `;
            container.appendChild(item);

            // Fetch lat/lng from JSON
            const lat = day.lat;
            const lng = day.lng;
            const locationType = day.location || 'default';

            // Event Listener para este item (Acordeón)
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                const isActive = item.classList.contains('active');

                const allItems = document.querySelectorAll('.timeline-accordion-item');

                // Cerrar otros
                allItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        // Resetear altura si se estuviera manejando con JS, pero css hace el trabajo con max-height
                    }
                });

                if (!isActive) {
                    item.classList.add('active');
                    // Actualizar mapa
                    updateMapForDay(lat, lng, day.title, day.day.toString(), locationType);
                } else {
                    item.classList.remove('active');
                    markerLayer.clearLayers();
                    // Volver a vista general Japón
                    map.flyTo([36.2048, 138.2529], 6);
                }
            });
        });

        // Opcional: Abrir el primer día por defecto después de un momento
        if (container.children.length > 0) {
            // Descomentar si se desea que el día 1 inicie abierto
            // setTimeout(() => {
            //     container.children[0].querySelector('.accordion-header').click();
            // }, 1000);
        }
    })
    .catch(err => {
        console.error('Error cargando itinerario:', err);
        document.querySelector('.itinerario-timeline-accordion').innerHTML = '<p style="padding:2rem;">Cargando itinerario...</p>';
    });

console.log('🗾 Propuesta Japón - Full JSON Render');



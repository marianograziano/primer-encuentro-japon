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

// ===== MAPA INTERACTIVO =====
// Inicializar el mapa centrado en Japón
const map = L.map('map', {
    center: [36.2048, 138.2529],
    zoom: 6,
    scrollWheelZoom: false,
    zoomControl: true
});

// Añadir capa de mapa con estilo personalizado
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Definir ubicaciones del itinerario
const locations = [
    {
        name: 'Tokio',
        coords: [35.6762, 139.6503],
        color: '#DC2626',
        days: [1, 2, 10, 11, 12, 13, 14, 15],
        description: 'Capital vibrante: tradición y modernidad'
    },
    {
        name: 'Monte Fuji / Kawaguchiko',
        coords: [35.5000, 138.7667],
        color: '#7C3AED',
        days: [3],
        description: 'Vistas icónicas del Monte Fuji'
    },
    {
        name: 'Kioto',
        coords: [35.0116, 135.7681],
        color: '#059669',
        days: [4, 5, 6],
        description: 'Corazón espiritual de Japón'
    },
    {
        name: 'Osaka',
        coords: [34.6937, 135.5023],
        color: '#EA580C',
        days: [8, 9],
        description: 'Gastronomía y vida nocturna'
    },
    {
        name: 'Nara',
        coords: [34.6851, 135.8050],
        color: '#0891B2',
        days: [7],
        description: 'Templos antiguos y ciervos sagrados'
    },
    {
        name: 'Kamakura',
        coords: [35.3192, 139.5466],
        color: '#8B5CF6',
        days: [13],
        description: 'Gran Buda y templos históricos'
    }
];

// Crear marcadores personalizados
locations.forEach(location => {
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: 30px;
                height: 30px;
                background: ${location.color};
                border: 4px solid white;
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 12px;
            ">${location.days.length}</div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    const marker = L.marker(location.coords, { icon: customIcon }).addTo(map);

    const popupContent = `
        <div style="font-family: 'Inter', sans-serif; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; color: ${location.color}; font-size: 16px; font-weight: 700;">${location.name}</h3>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #6B7280;">${location.description}</p>
            <p style="margin: 0; font-size: 12px; font-weight: 600; color: #2C3E2E;">
                ${location.days.length > 1 ? 'Días' : 'Día'}: ${location.days.join(', ')}
            </p>
        </div>
    `;

    marker.bindPopup(popupContent);
});

// Dibujar líneas de ruta
const routeCoordinates = [
    [35.6762, 139.6503], // Tokio
    [35.5000, 138.7667], // Fuji
    [35.0116, 135.7681], // Kioto
    [34.6851, 135.8050], // Nara
    [34.6937, 135.5023], // Osaka
    [35.6762, 139.6503], // Tokio
    [35.3192, 139.5466], // Kamakura
    [35.6762, 139.6503]  // Tokio
];

const route = L.polyline(routeCoordinates, {
    color: '#8B9556',
    weight: 3,
    opacity: 0.7,
    dashArray: '10, 10',
    lineJoin: 'round'
}).addTo(map);

// Ajustar el mapa para mostrar toda la ruta
map.fitBounds(route.getBounds(), { padding: [50, 50] });

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

// Observar elementos para animación
document.querySelectorAll('.tematica-card, .timeline-item, .feature-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
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

// ===== ITINERARIO INTERACTIVO (ACCORDEON + MAPA) =====
const accordionItems = document.querySelectorAll('.timeline-accordion-item');

accordionItems.forEach(item => {
    item.addEventListener('click', () => {
        const lat = parseFloat(item.getAttribute('data-lat'));
        const lng = parseFloat(item.getAttribute('data-lng'));
        const isActive = item.classList.contains('active');

        // Cerrar otros items activos
        accordionItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });

        // Toggle el item actual
        if (!isActive) {
            item.classList.add('active');

            // Centrar mapa en la ubicación específica del día
            map.flyTo([lat, lng], 13, {
                animate: true,
                duration: 1.5
            });
        } else {
            // Si cerramos, volvemos a vista general (opcional)
            map.fitBounds(route.getBounds(), { padding: [50, 50] });
        }
    });
});

// Inicializar el primer día como activo al cargar (opcional)
// accordionItems[0].click();

// Actualizar marcadores para mostrar el total de días (15)
// (Nota: los marcadores ya se crearon arriba, esto es solo por si queremos ajustar el HTML de los marcadores dinámicamente)

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');

    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===== CONTADOR DE DÍAS =====
function createDayCounter() {
    const timelineMarkers = document.querySelectorAll('.timeline-marker');

    timelineMarkers.forEach((marker, index) => {
        marker.style.animation = `fadeInScale 0.5s ease forwards ${index * 0.1}s`;
    });
}

// Añadir animación CSS para los marcadores
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.5);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .custom-marker {
        animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
`;
document.head.appendChild(style);

// Inicializar contador cuando el itinerario sea visible
const itinerarioSection = document.querySelector('.itinerario-section');
const itinerarioObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            createDayCounter();
            itinerarioObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

if (itinerarioSection) {
    itinerarioObserver.observe(itinerarioSection);
}

// ===== LOADING OPTIMIZATION =====
window.addEventListener('load', () => {
    // Lazy loading para imágenes
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// ===== EASTER EGG: Click en el Monte Fuji =====
const heroBackground = document.querySelector('.hero-background');
let clickCount = 0;

heroBackground.addEventListener('click', () => {
    clickCount++;

    if (clickCount === 3) {
        // Crear efecto de nieve (sakura)
        createSakuraEffect();
        clickCount = 0;
    }
});

function createSakuraEffect() {
    const sakuraContainer = document.createElement('div');
    sakuraContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;

    document.body.appendChild(sakuraContainer);

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const sakura = document.createElement('div');
            sakura.textContent = '🌸';
            sakura.style.cssText = `
                position: absolute;
                top: -50px;
                left: ${Math.random() * 100}%;
                font-size: ${Math.random() * 20 + 15}px;
                animation: fall ${Math.random() * 3 + 3}s linear forwards;
                opacity: ${Math.random() * 0.5 + 0.5};
            `;

            sakuraContainer.appendChild(sakura);

            setTimeout(() => sakura.remove(), 6000);
        }, i * 100);
    }

    setTimeout(() => sakuraContainer.remove(), 7000);
}

// Añadir animación de caída
const sakuraStyle = document.createElement('style');
sakuraStyle.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sakuraStyle);

console.log('🗾 Viajemos a Japón - Website cargado exitosamente');
console.log('💡 Tip: Haz click 3 veces en el hero para una sorpresa...');

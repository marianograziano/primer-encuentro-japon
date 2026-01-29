# Viajemos a Japón

Este proyecto es una landing page promocional para una experiencia de viaje guiada a Japón.

## Infraestructura

El sitio se encuentra alojado en un **VPS de Hostinger**.

### Contenedor
La aplicación corre dentro de un contenedor Docker llamado **`viajemosajapon_web_1`**.

- **Imagen Base**: Nginx (Alpine Linux para ligereza).
- **Servidor Web**: Nginx configurado para servir contenido estático.
- **Puertos**: Expone el puerto 80.

### Stack Tecnológico
El proyecto es estático y no utiliza frameworks pesados ni bases de datos.

- **HTML5**: Semántico y optimizado.
- **CSS3**: Estilos personalizados utilizando variables CSS modernas.
- **JavaScript (Vanilla)**: Lógica ligera para interactividad (mapa, acordeones).
- **Librerías Externas**:
    - `Leaflet.js`: Para el mapa interactivo del itinerario.
    - `Google Fonts`: Tipografías (Inter y Playfair Display).

## Dominio
El sitio es accesible públicamente en: **[viajemosajapon.com](https://viajemosajapon.com)**

## Contenido
El sitio detalla una propuesta de viaje de 14 días que incluye:
- **Itinerario día a día**: Tokio, Kioto, Osaka, Hiroshima, Nara, Hakone.
- **Experiencias**: Gastronomía, espiritualidad, literatura, naturaleza y vida urbana.
- **Mapa interactivo**: Visualización de los puntos de interés.

## Estructura de Archivos
- `index.html`: Estructura principal.
- `styles.css`: Hoja de estilos.
- `script.js`: Lógica del cliente.
- `itinerary.json`: Datos estructurados del itinerario.
- `assets/images/`: Imágenes optimizadas y favicon.

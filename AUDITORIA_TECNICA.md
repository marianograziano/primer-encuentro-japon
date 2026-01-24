# Auditoría Técnica del Proyecto: Proyecto Japón

**Fecha:** 24 de Enero, 2026
**Estatura:** Análisis de infraestructura, código y despliegue.

## 1. Estado Actual del Proyecto

El proyecto se encuentra en un estado **híbrido y potencialmente confuso**. Existen dos estructuras de código conviviendo en el mismo repositorio, pero solo una está activa.

### A. La Versión Activa (Static Site)
Actualmente, el sitio funciona como una **página web estática tradicional**.
- **Archivos Core**: `index.html`, `script.js`, `styles.css`.
- **Datos**: Carga contenido dinámico mediante `fetch` a archivos JSON locales (`content.json`, `itinerary.json`).
- **Tecnología**: HTML5, CSS3, JavaScript (Vanilla), Leaflet (Mapas).
- **Despliegue**: Esta es la versión que Docker está ejecutando actualmente.

### B. La Versión "Fantasma" (React/Vite)
Existe una estructura completa de una aplicación moderna en **React + TypeScript + Vite** que actualmente **NO se está utilizando**.
- **Archivos**: Carpeta `src/`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`.
- **Estado**: Esta aplicación **no funciona** actualmente porque el archivo `package.json` está vacío de dependencias (no tiene `react`, `vite`, etc.) y scripts de construcción.
- **Consecuencia**: Todo este código está "muerto" en el repositorio y añade peso innecesario si no se planea migrar.

---

## 2. Análisis de Docker

### Dockerfile Actual
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```
- **Funcionamiento**: Toma *todos* los archivos del directorio actual y los pone en la carpeta pública de Nginx.
- **Problema**: Está copiando archivos innecesarios al servidor de producción (`src/`, `docker-compose.yml`, `vite.config.ts`, `.git/`, archivos `.heic` sin procesar, etc.). Esto es una mala práctica de seguridad y optimización.
- **Seguridad**: Al copiar `.`, se exponen configuraciones y código fuente que no deberían ser públicos.

### Docker Compose
Está configurado correctamente para levantar el servicio `web` en el puerto `8082`.

---

## 3. Análisis de Git y GitHub

- **Rama**: `main`.
- **Estado**: Limpio, actualizado con `origin/main`.
- **.gitignore**: Muy básico (solo ignora `node_modules` y `.DS_Store`).
- **Recomendación**: El `.gitignore` debería ser mucho más robusto para evitar subir archivos de sistema, logs, o archivos de entorno (`.env`) si los hubiera en el futuro.

---

## 4. Sugerencias y Plan de Acción

Tiene dos caminos principales a seguir. Recomiendo encarecidamente **DEFINIR** uno para evitar deuda técnica.

### Opción 1: Mantenerse en Vanilla JS (Recomendada si el sitio ya funciona bien)
Si el sitio actual (`index.html` + `script.js`) cubre las necesidades, la estructura de React sobra.

**Pasos:**
1.  **Limpieza**: Eliminar la carpeta `src/`, y los archivos de configuración de Vite/React (`vite.config.ts`, `tsconfig.*`, `tailwind.config.ts`, `eslint.config.js`).
2.  **Optimizar Dockerfile**: Configurar Nginx para copiar solo los archivos necesarios (`.html`, `.css`, `.js`, assets) y no todo el directorio.
3.  **Dependencias**: Actualizar `package.json` para que esté limpio o sirva para herramientas de desarrollo sencillas (como `prettier` o un servidor local simple).

### Opción 2: Migrar a React (Siguiente Nivel)
Si el objetivo es modernizar la app y usar la estructura que está en `src/`.

**Pasos:**
1.  **Reparar `package.json`**: Reinstalar las dependencias de Vite, React y TypeScript.
2.  **Migrar Lógica**: Mover la lógica de `script.js` a componentes de React.
3.  **Actualizar Docker**: Cambiar el `Dockerfile` a un "Multi-stage build":
    - *Stage 1*: Usa Node.js para compilar el proyecto (`npm run build`).
    - *Stage 2*: Usa Nginx para servir solo la carpeta `dist/` generada.

### Recomendación General Inmediata (Quick Wins)
Independientemente de la opción elegida, aplique estas mejoras ahora:

1.  **Mejorar `.dockerignore`**: Para evitar copiar archivos basura al contenedor.
2.  **Limpiar Assets**: Hay archivos `.HEIC` pesados sin trackear en carpetas de imágenes. Deberían convertirse a JPG/WebP y eliminarse los originales para no inflar el repo/imagen.

---

## Ejemplo: Mejorando el Dockerfile para el sitio actual (Opción 1)

**`.dockerignore` sugerido:**
```text
.git
.gitignore
docker-compose.yml
Dockerfile
README.md
src
vite.config.ts
tsconfig.*
*.HEIC
node_modules
```

**Nuevo `Dockerfile` más limpio:**
```dockerfile
FROM nginx:alpine
# Copiar configuración de nginx personalizada si existe (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar solo lo necesario
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY content.json /usr/share/nginx/html/
COPY itinerary.json /usr/share/nginx/html/
COPY *.png /usr/share/nginx/html/
# Copiar carpetas de assets
COPY espiritualidad /usr/share/nginx/html/espiritualidad
COPY gastronomia /usr/share/nginx/html/gastronomia
COPY literatura /usr/share/nginx/html/literatura
COPY naturaleza /usr/share/nginx/html/naturaleza
COPY onsen /usr/share/nginx/html/onsen
COPY vibrante /usr/share/nginx/html/vibrante
COPY public /usr/share/nginx/html/public

EXPOSE 80
```

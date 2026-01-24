FROM nginx:alpine

# Copy static assets
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY content.json /usr/share/nginx/html/
COPY itinerary.json /usr/share/nginx/html/

# Copy image assets
# Only copying the specific directories used in the site
COPY espiritualidad /usr/share/nginx/html/espiritualidad
COPY gastronomia /usr/share/nginx/html/gastronomia
COPY literatura /usr/share/nginx/html/literatura
COPY naturaleza /usr/share/nginx/html/naturaleza
COPY onsen /usr/share/nginx/html/onsen
COPY vibrante /usr/share/nginx/html/vibrante
COPY public /usr/share/nginx/html/public
COPY christian.png /usr/share/nginx/html/
COPY hero_japan_shadows.png /usr/share/nginx/html/

EXPOSE 80

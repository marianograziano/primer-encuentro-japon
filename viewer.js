
document.addEventListener('DOMContentLoaded', async function () {
    // Relative path works for both local and production if served from same origin
    const API_BASE = '/api';

    try {
        const response = await fetch(`${API_BASE}/sections`);
        if (!response.ok) return;
        const { data } = await response.json();

        data.forEach(section => {
            const el = document.querySelector(`[data-section-id="${section.id}"]`);
            if (el) {
                // Restore Layout
                ['layout-left-img', 'layout-right-img', 'layout-stacked', 'layout-overlay', 'layout-minimal'].forEach(l => el.classList.remove(l));

                if (section.layout && section.layout !== 'default') {
                    el.classList.remove('reverse');
                    el.classList.add(section.layout);
                }

                // Restore Content
                if (section.content_html) {
                    const contentContainer = el.querySelector('.tematica-content');
                    if (contentContainer) contentContainer.innerHTML = section.content_html;
                }

                // Restore Images
                if (section.images_html) {
                    const imageContainer = el.querySelector('.tematica-image');
                    if (imageContainer) imageContainer.innerHTML = section.images_html;
                }
            }
        });
    } catch (e) {
        console.error("Failed to load dynamic content:", e);
    }
});

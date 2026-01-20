
document.addEventListener('DOMContentLoaded', async function () {
    console.log("Theme Editor Initialized - Persistence Enbaled");

    // ===== CONFIGURATION =====
    const API_BASE = 'http://localhost:3000/api'; // Adjust port if needed

    // ===== LOAD SAVED STATE =====
    try {
        const response = await fetch(`${API_BASE}/sections`);
        const { data } = await response.json();

        data.forEach(section => {
            const el = document.querySelector(`[data-section-id="${section.id}"]`);
            if (el) {
                // Restore Layout
                // Remove all layout classes first
                ['layout-left-img', 'layout-right-img', 'layout-stacked', 'layout-overlay', 'layout-minimal'].forEach(l => el.classList.remove(l));

                if (section.layout && section.layout !== 'default') {
                    el.classList.remove('reverse'); // Clear default reverse
                    el.classList.add(section.layout);
                    // Update active button state if controls exist
                    const defaultBtn = el.querySelector(`[data-layout="${section.layout}"]`);
                    if (defaultBtn) {
                        el.querySelectorAll('.wireframe-btn').forEach(b => b.classList.remove('active'));
                        defaultBtn.classList.add('active');
                    }
                }

                // Restore Content
                if (section.content_html) {
                    const contentContainer = el.querySelector('.tematica-content');
                    if (contentContainer) contentContainer.innerHTML = section.content_html;
                }

                // Restore Images
                if (section.images_html) {
                    const imageContainer = el.querySelector('.tematica-image');
                    // Check if structure matches (e.g. grid vs single)
                    // We simply replace innerHTML of the container. 
                    // This assumes the container structure hasn't fundamentally changed in way that breaks CSS.
                    if (imageContainer) imageContainer.innerHTML = section.images_html;
                }
            }
        });
        console.log("Content loaded successfully");
    } catch (e) {
        console.error("Failed to load content:", e);
    }


    // ===== WIREFRAMES =====
    const wires = {
        left: `<svg width="40" height="28" viewBox="0 0 40 28" fill="none" stroke="#666" stroke-width="1.5"><rect x="1" y="1" width="38" height="26" rx="2" stroke="#ddd" fill="#fff"/><rect x="3" y="3" width="16" height="22" rx="1" fill="#e0e0e0" stroke="none"/><line x1="22" y1="5" x2="36" y2="5"/><line x1="22" y1="9" x2="34" y2="9"/><line x1="22" y1="13" x2="36" y2="13"/><line x1="22" y1="17" x2="30" y2="17"/></svg>`,
        right: `<svg width="40" height="28" viewBox="0 0 40 28" fill="none" stroke="#666" stroke-width="1.5"><rect x="1" y="1" width="38" height="26" rx="2" stroke="#ddd" fill="#fff"/><rect x="21" y="3" width="16" height="22" rx="1" fill="#e0e0e0" stroke="none"/><line x1="4" y1="5" x2="18" y2="5"/><line x1="4" y1="9" x2="16" y2="9"/><line x1="4" y1="13" x2="18" y2="13"/><line x1="4" y1="17" x2="12" y2="17"/></svg>`,
        stacked: `<svg width="40" height="28" viewBox="0 0 40 28" fill="none" stroke="#666" stroke-width="1.5"><rect x="1" y="1" width="38" height="26" rx="2" stroke="#ddd" fill="#fff"/><rect x="3" y="3" width="34" height="10" rx="1" fill="#e0e0e0" stroke="none"/><line x1="4" y1="17" x2="36" y2="17"/><line x1="4" y1="21" x2="26" y2="21"/></svg>`,
        overlay: `<svg width="40" height="28" viewBox="0 0 40 28" fill="none" stroke="#666" stroke-width="1.5"><rect x="1" y="1" width="38" height="26" rx="2" fill="#e0e0e0" stroke="none"/><rect x="8" y="6" width="24" height="16" rx="1" fill="#fff" stroke="#999"/><line x1="12" y1="11" x2="28" y2="11" stroke="#999"/><line x1="12" y1="15" x2="24" y2="15" stroke="#999"/></svg>`,
        minimal: `<svg width="40" height="28" viewBox="0 0 40 28" fill="none" stroke="#666" stroke-width="1.5"><rect x="1" y="1" width="38" height="26" rx="2" stroke="#ddd" fill="#fff"/><text x="3" y="14" font-family="serif" font-size="12" fill="#333" stroke="none">Aa</text><rect x="22" y="3" width="15" height="22" rx="1" fill="#e0e0e0" stroke="none"/></svg>`
    };

    // ===== 1. LAYOUT & TEXT CONTROLS =====
    const cards = document.querySelectorAll('.tematica-card');
    cards.forEach((card) => {
        // Init Editable Text
        const textElements = card.querySelectorAll('h3, p, li, blockquote');
        textElements.forEach(el => {
            el.setAttribute('contenteditable', 'true');
            el.addEventListener('paste', e => {
                e.preventDefault();
                document.execCommand('insertText', false, (e.originalEvent || e).clipboardData.getData('text/plain'));
            });
            el.addEventListener('drop', e => e.preventDefault());
        });

        // Init Controls
        // Check if controls already exist (due to reload)
        if (!card.querySelector('.theme-editor-controls')) {
            const controls = document.createElement('div');
            controls.className = 'theme-editor-controls';
            controls.innerHTML = `
                <div class="control-group">
                    <span class="control-label">ESTRUCTURA</span>
                    <div class="layout-buttons wireframe-mode">
                        <button class="editor-btn wireframe-btn" data-layout="layout-left-img" title="Imagen Izquierda">${wires.left}</button>
                        <button class="editor-btn wireframe-btn" data-layout="layout-right-img" title="Imagen Derecha">${wires.right}</button>
                        <button class="editor-btn wireframe-btn" data-layout="layout-stacked" title="Apilado">${wires.stacked}</button>
                        <button class="editor-btn wireframe-btn" data-layout="layout-overlay" title="Superpuesto">${wires.overlay}</button>
                        <button class="editor-btn wireframe-btn" data-layout="layout-minimal" title="Minimal">${wires.minimal}</button>
                        <button class="editor-btn text-reset-btn" data-layout="default" title="Resetear">↺</button>
                    </div>
                </div>`;

            if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
            card.appendChild(controls);

            const btns = controls.querySelectorAll('.editor-btn');
            const layouts = ['layout-left-img', 'layout-right-img', 'layout-stacked', 'layout-overlay', 'layout-minimal'];
            btns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetBtn = e.target.closest('button');
                    if (!targetBtn) return;
                    const layout = targetBtn.dataset.layout;
                    // Apply layout
                    layouts.forEach(l => card.classList.remove(l));
                    if (layout !== 'default') { card.classList.remove('reverse'); card.classList.add(layout); }

                    // Update UI
                    btns.forEach(b => b.classList.remove('active'));
                    targetBtn.classList.add('active');
                });
            });
        }
    });

    // ===== 2. IMAGE HANDLER (Upload to Server) =====
    // Re-runable initializer for images
    const refreshImageHandlers = () => {
        const imageContainers = document.querySelectorAll('.tematica-image, .zen-card-image, .gallery-item, .gallery-main');

        imageContainers.forEach(container => {
            if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
            const items = container.querySelectorAll('img');

            items.forEach(img => {
                img.style.cursor = 'pointer';
                img.title = "Click para editar";

                img.onclick = (e) => {
                    e.preventDefault(); e.stopPropagation();
                    document.querySelectorAll('.img-context-menu').forEach(el => el.remove());

                    const menu = document.createElement('div');
                    menu.className = 'img-context-menu';
                    menu.innerHTML = `
                        <button class="menu-btn change-btn">📸 Cambiar Imagen</button>
                        <button class="menu-btn caption-btn">📝 Agregar Copete</button>
                        <button class="menu-btn delete-btn">🗑️ Eliminar</button>
                        <button class="menu-btn cancel-btn">✖</button>
                    `;

                    const top = img.offsetTop + (img.offsetHeight / 2) - 40;
                    const left = img.offsetLeft + (img.offsetWidth / 2) - 70;
                    menu.style.top = `${top}px`; menu.style.left = `${left}px`;
                    container.appendChild(menu);

                    // 1. CHANGE (Upload)
                    menu.querySelector('.change-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        const input = document.createElement('input');
                        input.type = 'file'; input.accept = 'image/*'; input.style.display = 'none';
                        input.onchange = async (ev) => {
                            if (ev.target.files[0]) {
                                const file = ev.target.files[0];

                                // Upload to Server
                                const formData = new FormData();
                                formData.append('image', file);

                                try {
                                    const res = await fetch(`${API_BASE}/upload`, {
                                        method: 'POST',
                                        body: formData
                                    });
                                    if (res.ok) {
                                        const result = await res.json();
                                        img.src = result.url; // Use server URL
                                    } else {
                                        alert("Error uploading image");
                                    }
                                } catch (err) {
                                    console.error(err);
                                    alert("Upload failed");
                                }
                                menu.remove();
                            }
                        };
                        input.click();
                    });

                    // 2. CAPTION
                    menu.querySelector('.caption-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        let wrapper = img.parentElement;
                        let caption;
                        if (wrapper.tagName.toLowerCase() !== 'figure') {
                            const figure = document.createElement('figure');
                            figure.className = 'img-wrapper-figure';
                            img.parentNode.insertBefore(figure, img);
                            figure.appendChild(img);
                            caption = document.createElement('figcaption');
                            caption.innerText = "Escribe un copete...";
                            caption.contentEditable = true;
                            figure.appendChild(caption);
                            wrapper = figure;
                        } else {
                            caption = wrapper.querySelector('figcaption');
                            if (!caption) {
                                caption = document.createElement('figcaption');
                                caption.innerText = "Escribe un copete...";
                                caption.contentEditable = true;
                                wrapper.appendChild(caption);
                            }
                        }
                        menu.remove();
                        setTimeout(() => caption.focus(), 100);
                    });

                    // 3. DELETE
                    menu.querySelector('.delete-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (confirm("¿Eliminar?")) {
                            if (img.parentElement.tagName.toLowerCase() === 'figure') img.parentElement.remove();
                            else img.remove();
                            menu.remove();
                        }
                    });

                    // 4. CANCEL
                    menu.querySelector('.cancel-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        menu.remove();
                    });
                };
            });
        });
    };
    refreshImageHandlers();

    // Close menus handler
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.img-context-menu')) document.querySelectorAll('.img-context-menu').forEach(el => el.remove());
    });


    // ===== 3. GLOBAL SAVE BUTTON =====
    const saveBtn = document.createElement('button');
    saveBtn.innerText = "💾 GUARDAR CAMBIOS";
    saveBtn.style.cssText = `
        position: fixed; bottom: 30px; right: 30px;
        background: #28a745; color: white; border: none;
        padding: 15px 30px; border-radius: 50px;
        font-weight: bold; box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        cursor: pointer; z-index: 9999; font-size: 16px;
        transition: transform 0.2s;
    `;
    saveBtn.onmouseover = () => saveBtn.style.transform = "scale(1.05)";
    saveBtn.onmouseout = () => saveBtn.style.transform = "scale(1)";

    saveBtn.onclick = async () => {
        saveBtn.innerText = "⏳ Guardando...";
        saveBtn.disabled = true;

        const sections = document.querySelectorAll('[data-section-id]');
        const updates = [];

        sections.forEach(sec => {
            const id = sec.dataset.sectionId;
            let layout = 'default';
            if (sec.classList.contains('layout-left-img')) layout = 'layout-left-img';
            else if (sec.classList.contains('layout-right-img')) layout = 'layout-right-img';
            else if (sec.classList.contains('layout-stacked')) layout = 'layout-stacked';
            else if (sec.classList.contains('layout-overlay')) layout = 'layout-overlay';
            else if (sec.classList.contains('layout-minimal')) layout = 'layout-minimal';

            const contentHtml = sec.querySelector('.tematica-content') ? sec.querySelector('.tematica-content').innerHTML : '';
            const imagesHtml = sec.querySelector('.tematica-image') ? sec.querySelector('.tematica-image').innerHTML : '';

            updates.push({ id, layout, content_html: contentHtml, images_html: imagesHtml });
        });

        // Send all updates
        // We can do parallel or serial. Serial is safer for SQLite concurrent writes usually, 
        // though Node handles it.
        try {
            for (const update of updates) {
                await fetch(`${API_BASE}/save`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(update)
                });
            }
            saveBtn.innerText = "✅ ¡Guardado!";
            setTimeout(() => { saveBtn.innerText = "💾 GUARDAR CAMBIOS"; saveBtn.disabled = false; }, 2000);
        } catch (e) {
            console.error(e);
            saveBtn.innerText = "❌ Error";
            alert("Hubo un error al guardar los cambios.");
            setTimeout(() => { saveBtn.innerText = "💾 GUARDAR CAMBIOS"; saveBtn.disabled = false; }, 2000);
        }
    };

    document.body.appendChild(saveBtn);
});

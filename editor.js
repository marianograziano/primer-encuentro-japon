
document.addEventListener('DOMContentLoaded', async function () {
    console.log("Theme Editor Initialized - Clean Mode");
    const API_BASE = '/api';

    // Inject Sidebar HTML (Simplified)
    const sidebarHtml = `
        <div class="overlay-backdrop" id="editorBackdrop"></div>
        <div class="editor-sidebar" id="editorSidebar">
            <div class="sidebar-header">
                <h3 class="sidebar-title">Editar Bloque</h3>
                <button class="close-sidebar-btn" id="closeSidebar">&times;</button>
            </div>
            <div class="sidebar-content">
                <!-- Layout Selection -->
                <div class="control-group">
                    <span class="group-label">Distribución Visual</span>
                    <div class="layout-options" id="sidebarLayouts"></div>
                </div>

                <!-- Text Content -->
                <div class="control-group">
                    <span class="group-label">Título</span>
                    <input type="text" id="sidebarTitleInput" class="sidebar-input">
                </div>
                <div class="control-group">
                    <span class="group-label">Texto (Párrafos)</span>
                    <textarea id="sidebarContentInput" class="sidebar-textarea" placeholder="Escribe aquí... Usa Enter para separar párrafos."></textarea>
                    <small style="color:#999; display:block; margin-top:5px;">Se respeta la tipografía original del sitio.</small>
                </div>

                <!-- Images -->
                <div class="control-group">
                    <span class="group-label">Galería de Imágenes</span>
                    <div class="image-manager-list" id="sidebarImages"></div>
                    <button class="add-image-btn" id="sidebarAddImageBtn">+ Subir Imagen</button>
                    <input type="file" id="sidebarHiddenInput" accept="image/*" style="display:none">
                </div>
            </div>
            <div class="sidebar-footer">
                <button class="sidebar-save-btn" id="sidebarSaveBtn">Guardar Cambios</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', sidebarHtml);

    // State
    let currentSection = null;
    let currentImages = [];

    // Elements
    const sidebar = document.getElementById('editorSidebar');
    const backdrop = document.getElementById('editorBackdrop');
    const layoutContainer = document.getElementById('sidebarLayouts');
    const imageList = document.getElementById('sidebarImages');
    const titleInput = document.getElementById('sidebarTitleInput');
    const contentInput = document.getElementById('sidebarContentInput');
    const addImageBtn = document.getElementById('sidebarAddImageBtn');
    const hiddenInput = document.getElementById('sidebarHiddenInput');

    // Layouts
    const layouts = [
        { id: 'default', name: 'Original', icon: '<rect x="2" y="5" width="9" height="14"/><rect x="13" y="5" width="9" height="14"/>' },
        { id: 'layout-left-img', name: 'Img Izquierda', icon: '<rect x="2" y="5" width="8" height="14" fill="#ccc"/><lines x="12" y="5"/>' },
        { id: 'layout-right-img', name: 'Img Derecha', icon: '<rect x="14" y="5" width="8" height="14" fill="#ccc"/><lines x="2" y="5"/>' },
        { id: 'layout-stacked', name: 'Apilado', icon: '<rect x="4" y="2" width="16" height="8" fill="#ccc"/><lines x="4" y="12"/>' },
        { id: 'layout-overlay', name: 'Fondo', icon: '<rect x="2" y="2" width="20" height="20" fill="#ccc"/><rect x="6" y="8" width="12" height="8" fill="white"/>' },
        { id: 'layout-minimal', name: 'Minimal', icon: '<text x="2" y="15" font-size="20">A</text>' }
    ];

    layoutContainer.innerHTML = layouts.map(l => `
        <div class="layout-btn" data-layout="${l.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${l.icon}</svg>
            <span>${l.name}</span>
        </div>
    `).join('');

    // ===== LOGIC =====

    function openSidebar(section) {
        currentSection = section;
        section.classList.add('editing-active');
        sidebar.classList.add('open');
        backdrop.classList.add('visible');

        // 1. Layout State
        const currentLayout = layouts.find(l => section.classList.contains(l.id))?.id || 'default';
        document.querySelectorAll('.layout-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.layout === currentLayout));

        // 2. Text Content (Extraction)
        const h3 = section.querySelector('h3');
        titleInput.value = h3 ? h3.innerText : '';

        // Extract paragraphs cleanly
        // We look for <p> and <li> to convert to plain text with newlines
        // This strips existing bold/italic HTML which might be annoying if user wants to keep it,
        // but ensures clean font rendering. 
        // Improvement: Keep innerHTML but strip wrapper tags?
        // Let's use innerText but respect paragraphs as newlines.
        const contentContainer = section.querySelector('.tematica-content');
        if (contentContainer) {
            // Filter out the H3 and UL/LI structure mess, focus on Ps
            // Or just grab all Ps
            const paras = Array.from(contentContainer.querySelectorAll('p'));
            const listItems = Array.from(contentContainer.querySelectorAll('li'));

            // Allow user to edit raw text? No, too hard.
            // Let's just grab text content of paragraphs combined with newlines.

            // BETTER APPROACH: Clone content, remove H3, get innerHTML of rest?
            // This preserves <strong> tags if they exist.
            const clone = contentContainer.cloneNode(true);
            const title = clone.querySelector('h3');
            if (title) title.remove();

            // Clean up: Replace <p> with nothing (just break lines), replace <br> with newline layout
            // Regex to convert HTML to "Editable Text"
            let html = clone.innerHTML.trim();
            // Replace <p>...</p> with text + \n\n
            // This is complex. 
            // SIMPLEST: multiple textareas? No.
            // Just one textarea. We will inject <p> tags on save.

            // For now, let's grab textContent. It loses bolding. 
            // If user wants bolding, we can allow <b> tags in textarea.
            contentInput.value = paras.map(p => p.innerText).join('\n\n');

            // Append lists if any
            if (listItems.length > 0) {
                contentInput.value += '\n\n' + listItems.map(li => '- ' + li.innerText).join('\n');
            }
        }

        // 3. Images
        loadImages();
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        backdrop.classList.remove('visible');
        if (currentSection) currentSection.classList.remove('editing-active');
        currentSection = null;
    }

    function loadImages() {
        if (!currentSection) return;
        const container = currentSection.querySelector('.tematica-image');
        currentImages = [];
        if (container) {
            container.querySelectorAll('img').forEach(img => {
                currentImages.push({ src: img.getAttribute('src') });
            });
        }
        renderImages();
    }

    function renderImages() {
        imageList.innerHTML = '';
        currentImages.forEach((img, idx) => {
            const div = document.createElement('div');
            div.className = 'image-item';
            div.innerHTML = `
                <img src="${img.src}" class="image-preview">
                <div class="image-actions">
                    <button class="mini-btn move-up" data-index="${idx}">⬆️</button>
                    <button class="mini-btn move-down" data-index="${idx}">⬇️</button>
                    <button class="mini-btn delete" data-index="${idx}">🗑️</button>
                </div>
            `;
            imageList.appendChild(div);
        });

        // Listeners included inline logic for brevity or attached here
        imageList.querySelectorAll('.delete').forEach(b => b.onclick = () => {
            currentImages.splice(b.dataset.index, 1); renderImages(); updatePreview();
        });
        imageList.querySelectorAll('.move-up').forEach(b => b.onclick = () => {
            const i = +b.dataset.index;
            if (i > 0) { [currentImages[i], currentImages[i - 1]] = [currentImages[i - 1], currentImages[i]]; renderImages(); updatePreview(); }
        });
        imageList.querySelectorAll('.move-down').forEach(b => b.onclick = () => {
            const i = +b.dataset.index;
            if (i < currentImages.length - 1) { [currentImages[i], currentImages[i + 1]] = [currentImages[i + 1], currentImages[i]]; renderImages(); updatePreview(); }
        });
    }

    // === REAL TIME UPDATERS ===

    function updatePreview() {
        if (!currentSection) return;

        // Images
        const imgContainer = currentSection.querySelector('.tematica-image');
        if (imgContainer) {
            // Auto grid class logic could go here if we wanted to be smart about 1 vs 4 images
            imgContainer.innerHTML = currentImages.map(i => `<img src="${i.src}">`).join('');
        }
    }

    function updateTextPreview() {
        if (!currentSection) return;
        const contentContainer = currentSection.querySelector('.tematica-content');
        if (!contentContainer) return;

        // Reconstruct HTML
        // 1. H3
        let html = `<h3>${titleInput.value}</h3>`;

        // 2. Body
        // Split by double newline for paragraphs
        const rawText = contentInput.value;
        const parts = rawText.split(/\n\s*\n/);

        parts.forEach(part => {
            if (part.trim().startsWith('-')) {
                // List
                const lines = part.split('\n');
                html += '<ul class="tematica-list">';
                lines.forEach(line => {
                    if (line.trim().startsWith('-')) {
                        html += `<li>${line.trim().substring(1).trim()}</li>`;
                    }
                });
                html += '</ul>';
            } else {
                // Paragraph
                if (part.trim().length > 0) html += `<p>${part.trim()}</p>`;
            }
        });

        contentContainer.innerHTML = html;
    }

    // Input Listeners
    titleInput.addEventListener('input', updateTextPreview);
    contentInput.addEventListener('input', updateTextPreview);


    // === GLOBAL LISTENERS ===

    // Cards Click
    document.querySelectorAll('.tematica-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.editor-sidebar')) return;
            openSidebar(card);
        });
    });

    // Close
    document.getElementById('closeSidebar').onclick = closeSidebar;
    backdrop.onclick = closeSidebar;

    // Layout
    document.querySelectorAll('.layout-btn').forEach(btn => {
        btn.onclick = () => {
            if (!currentSection) return;
            const layout = btn.dataset.layout;
            layouts.forEach(l => currentSection.classList.remove(l.id));
            if (layout !== 'default') {
                currentSection.classList.remove('reverse');
                currentSection.classList.add(layout);
            }
            document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });

    // Image Upload
    addImageBtn.onclick = () => hiddenInput.click();
    hiddenInput.onchange = async (e) => {
        if (e.target.files[0]) {
            const fd = new FormData();
            fd.append('image', e.target.files[0]);
            try {
                const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: fd });
                if (res.ok) {
                    const d = await res.json();
                    currentImages.push({ src: d.url });
                    renderImages();
                    updatePreview();
                }
            } catch (e) { alert("Error upload"); }
        }
    };

    // Save
    document.getElementById('sidebarSaveBtn').onclick = async () => {
        const btn = document.getElementById('sidebarSaveBtn');
        btn.innerText = "Guardando...";
        if (!currentSection) return;

        const id = currentSection.dataset.sectionId;
        // Determine layout
        let layout = 'default';
        layouts.forEach(l => { if (currentSection.classList.contains(l.id)) layout = l.id; });

        const contentHtml = currentSection.querySelector('.tematica-content').innerHTML;
        const imagesHtml = currentSection.querySelector('.tematica-image').innerHTML;

        try {
            await fetch(`${API_BASE}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, layout, content_html: contentHtml, images_html: imagesHtml })
            });
            btn.innerText = "Guardado";
            setTimeout(() => { btn.innerText = "Guardar Cambios"; closeSidebar(); }, 700);
        } catch (e) { alert("Error"); }
    };

    // Init Load
    try {
        const res = await fetch(`${API_BASE}/sections`);
        const { data } = await res.json();
        data.forEach(s => {
            const el = document.querySelector(`[data-section-id="${s.id}"]`);
            if (el) {
                layouts.forEach(l => el.classList.remove(l.id));
                if (s.layout && s.layout !== 'default') { el.classList.remove('reverse'); el.classList.add(s.layout); }
                if (s.content_html) el.querySelector('.tematica-content').innerHTML = s.content_html;
                if (s.images_html) el.querySelector('.tematica-image').innerHTML = s.images_html;
            }
        });
    } catch (e) { }

});

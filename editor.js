
document.addEventListener('DOMContentLoaded', async function () {
    console.log("Theme Editor Initialized - Secure Mode");
    const API_BASE = '/api';

    // 0. AUTH CHECK FIRST
    try {
        const authRes = await fetch(`${API_BASE}/me`);
        if (authRes.ok) {
            const authData = await authRes.json();
            if (!authData.isAdmin) {
                window.location.href = '/login.html';
                return; // Stop execution
            }
        }
    } catch (e) { console.error('Auth check fail', e); }


    // Inject Sidebar HTML
    // Inject Sidebar HTML
    const sidebarHtml = `
        <button id="floatingExitBtn" style="position:fixed; bottom:20px; left:20px; z-index:9999; background:#d9534f; color:white; border:none; padding:12px 24px; border-radius:30px; font-family:'Outfit',sans-serif; cursor:pointer; box-shadow:0 4px 15px rgba(0,0,0,0.2); font-weight:600; display:flex; align-items:center; gap:8px;">
            <span>🚪 Salir de Edición</span>
        </button>

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
                <button id="sidebarLogoutBtn" style="width:100%; margin-top:10px; background:#f0f0f0; color:#333; border:none; padding:10px; border-radius:8px; display:block; cursor:pointer;">Cerrar Sesión</button>
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

    function handleAuthError(res) {
        if (res.status === 401) {
            alert("Tu sesión ha expirado. Por favor ingresa nuevamente.");
            window.location.href = '/login.html';
            return true;
        }
        return false;
    }

    function openSidebar(section) {
        currentSection = section;
        section.classList.add('editing-active');
        sidebar.classList.add('open');
        backdrop.classList.add('visible');

        // 1. Layout State
        const currentLayout = layouts.find(l => section.classList.contains(l.id))?.id || 'default';
        document.querySelectorAll('.layout-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.layout === currentLayout));

        // 2. Text Content (Defensive)
        const h3 = section.querySelector('h3');
        titleInput.value = h3 ? h3.innerText : '';

        const contentContainer = section.querySelector('.tematica-content');
        if (contentContainer) {
            const clone = contentContainer.cloneNode(true);
            const title = clone.querySelector('h3');
            if (title) title.remove();

            // Convert paragraphs to text
            const paras = Array.from(clone.querySelectorAll('p, li'));
            if (paras.length > 0) {
                contentInput.value = paras.map(p => {
                    // Check if it's list item and add dash if needed?
                    if (p.tagName === 'LI') return '- ' + p.innerText;
                    return p.innerText;
                }).join('\n\n');
            } else {
                contentInput.value = clone.innerText.trim();
            }
        } else {
            contentInput.value = "";
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
        const container = currentSection.querySelector('.tematica-image') || currentSection.querySelector('.spiritual-gallery') || currentSection.querySelector('.zen-card-image');
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

    function updatePreview() {
        if (!currentSection) return;
        const imgContainer = currentSection.querySelector('.tematica-image') || currentSection.querySelector('.spiritual-gallery');
        if (imgContainer) {
            imgContainer.innerHTML = currentImages.map(i => `<img src="${i.src}">`).join('');
        }
    }

    function updateTextPreview() {
        if (!currentSection) return;
        const contentContainer = currentSection.querySelector('.tematica-content');
        if (!contentContainer) return;

        let html = `<h3>${titleInput.value}</h3>`;
        const rawText = contentInput.value;
        const parts = rawText.split(/\n\s*\n/);

        parts.forEach(part => {
            if (part.trim().startsWith('-')) {
                const lines = part.split('\n');
                html += '<ul class="tematica-list">';
                lines.forEach(line => {
                    if (line.trim().startsWith('-')) {
                        html += `<li>${line.trim().substring(1).trim()}</li>`;
                    }
                });
                html += '</ul>';
            } else {
                if (part.trim().length > 0) html += `<p>${part.trim()}</p>`;
            }
        });

        contentContainer.innerHTML = html;
    }

    titleInput.addEventListener('input', updateTextPreview);
    contentInput.addEventListener('input', updateTextPreview);

    document.querySelectorAll('.tematica-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.editor-sidebar')) return;
            openSidebar(card);
        });
    });

    document.getElementById('closeSidebar').onclick = closeSidebar;
    backdrop.onclick = closeSidebar;

    const logoutHandler = async () => {
        if (confirm("¿Estás seguro de que quieres salir del modo edición? Tendrás que ingresar la contraseña nuevamente.")) {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/';
        }
    };
    document.getElementById('floatingExitBtn').onclick = logoutHandler;
    document.getElementById('sidebarLogoutBtn').onclick = logoutHandler;

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

    addImageBtn.onclick = () => hiddenInput.click();
    hiddenInput.onchange = async (e) => {
        if (e.target.files[0]) {
            const fd = new FormData();
            fd.append('image', e.target.files[0]);
            try {
                const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: fd });
                if (handleAuthError(res)) return;

                if (res.ok) {
                    const d = await res.json();
                    currentImages.push({ src: d.url });
                    renderImages();
                    updatePreview();
                } else {
                    const errText = await res.text();
                    alert("Error subida: " + res.status + " " + errText);
                    console.error("Upload error", res.status, errText);
                }
            } catch (e) { alert("Error de red al subir imagen"); }
        }
    };

    document.getElementById('sidebarSaveBtn').onclick = async () => {
        const btn = document.getElementById('sidebarSaveBtn');
        btn.innerText = "Guardando...";
        if (!currentSection) return;

        const id = currentSection.dataset.sectionId;
        if (!id) { alert("Error: Card ID missing"); return; }

        let layout = 'default';
        layouts.forEach(l => { if (currentSection.classList.contains(l.id)) layout = l.id; });

        const c = currentSection.querySelector('.tematica-content');
        const i = currentSection.querySelector('.tematica-image');

        if (!c || !i) {
            alert("Error: Missing containers.");
            return;
        }

        const contentHtml = c.innerHTML;
        const imagesHtml = i.innerHTML;

        try {
            const res = await fetch(`${API_BASE}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, layout, content_html: contentHtml, images_html: imagesHtml })
            });

            if (handleAuthError(res)) return;

            if (res.ok) {
                btn.innerText = "Guardado";
                setTimeout(() => { btn.innerText = "Guardar Cambios"; closeSidebar(); }, 700);
            } else {
                alert("Error servidor: " + res.status);
            }
        } catch (e) { alert("Error conexión"); }
    };

    try {
        const res = await fetch(`${API_BASE}/sections`);
        const { data } = await res.json();
        data.forEach(s => {
            const el = document.querySelector(`[data-section-id="${s.id}"]`);
            if (el) {
                layouts.forEach(l => el.classList.remove(l.id));
                if (s.layout && s.layout !== 'default') { el.classList.remove('reverse'); el.classList.add(s.layout); }
                if (s.content_html) {
                    const c = el.querySelector('.tematica-content');
                    if (c) c.innerHTML = s.content_html;
                }
                if (s.images_html) {
                    const i = el.querySelector('.tematica-image');
                    if (i) i.innerHTML = s.images_html;
                }
            }
        });
    } catch (e) { }
});

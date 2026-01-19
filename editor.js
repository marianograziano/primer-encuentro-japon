
document.addEventListener('DOMContentLoaded', function () {
    console.log("Theme Editor Initialized");

    const cards = document.querySelectorAll('.tematica-card');

    cards.forEach((card, index) => {
        // 1. Make content editable
        const textElements = card.querySelectorAll('h3, p, li, blockquote');
        textElements.forEach(el => {
            el.setAttribute('contenteditable', 'true');
        });

        // 2. Inject Control Panel
        const controls = document.createElement('div');
        controls.className = 'theme-editor-controls';

        controls.innerHTML = `
            <button class="editor-btn" data-layout="default">Original</button>
            <button class="editor-btn" data-layout="layout-left-img">Img Izq</button>
            <button class="editor-btn" data-layout="layout-right-img">Img Der</button>
            <button class="editor-btn" data-layout="layout-stacked">Apilado</button>
            <button class="editor-btn" data-layout="layout-overlay">Overlay</button>
            <button class="editor-btn" data-layout="layout-minimal">Minimal</button>
        `;

        // Make card position relative if not already (to position controls)
        if (getComputedStyle(card).position === 'static') {
            card.style.position = 'relative';
        }

        card.appendChild(controls);

        // 3. Add Event Listeners
        const buttons = controls.querySelectorAll('.editor-btn');
        const layouts = [
            'layout-left-img',
            'layout-right-img',
            'layout-stacked',
            'layout-overlay',
            'layout-minimal'
        ];

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const layout = e.target.dataset.layout;

                // Remove all other layout classes
                layouts.forEach(l => card.classList.remove(l));

                // Remove 'reverse' class if present as it interferes
                if (layout !== 'default') {
                    card.classList.remove('reverse');
                }

                // Add new layout class if not default
                if (layout !== 'default') {
                    card.classList.add(layout);
                }

                // Update active state on buttons
                buttons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    });
});

/**
 * js/modals.js
 * Lógica para manejar la apertura y cierre de ventanas modales globales.
 */

import { STATE } from './config.js';
import { openGalleryModal } from './gallery.js';
import { initIcons } from './utils.js';

const defaultLoader = `
    <div class="flex items-center justify-center h-full min-h-[300px]">
        <i data-lucide="loader-2" class="w-8 h-8 text-light-muted dark:text-dark-muted animate-spin"></i>
    </div>
`;

/**
 * Cierra dinámicamente el modal global.
 */
export function closeModal() {
    const modalContainer = document.getElementById('global-modal');
    const modalWrapper = document.getElementById('modal-content-wrapper');
    const modalBody = document.getElementById('modal-body');

    if (!modalWrapper || !modalContainer) return;

    modalWrapper.classList.remove('scale-100', 'opacity-100');
    modalWrapper.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modalContainer.classList.add('opacity-0', 'pointer-events-none', 'hidden');
        document.body.style.overflow = ''; 
        if (modalBody) modalBody.innerHTML = ''; 
    }, 300);
}

/**
 * Abre un modal y carga su contenido mediante un archivo externo HTML.
 * @param {string} url - Ruta relativa del archivo HTML a cargar.
 */
export async function openModal(url) {
    const modalContainer = document.getElementById('global-modal');
    const modalWrapper = document.getElementById('modal-content-wrapper');
    const modalBody = document.getElementById('modal-body');

    if (!modalContainer || !modalWrapper || !modalBody) return;

    modalContainer.classList.remove('hidden');
    void modalContainer.offsetWidth; // Force reflow
    modalContainer.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';

    modalBody.innerHTML = defaultLoader;
    initIcons();

    setTimeout(() => {
        modalWrapper.classList.remove('scale-95', 'opacity-0');
        modalWrapper.classList.add('scale-100', 'opacity-100');
    }, 10);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();
        
        modalBody.innerHTML = html;
        initIcons();
    } catch (error) {
        console.error('Error loading modal content:', error);
        modalBody.innerHTML = `
            <div class="p-8 text-center text-red-500 font-mono">
                <p>Error cargando los datos del sistema.</p>
                <p class="text-xs mt-2">${error.message}</p>
            </div>
        `;
    }
}

/**
 * Inicia los "listeners" dinámicos en los botones que abren modales de proyecto.
 * @param {HTMLElement} root - Envoltorio raíz donde se buscarán los gatillos del modal.
 */
export function initDynamicModals(root = document) {
    const modalContainer = document.getElementById('global-modal');
    const modalWrapper = document.getElementById('modal-content-wrapper');
    const modalBody = document.getElementById('modal-body');

    if (!window._globalModalInitialized) {
        window._globalModalInitialized = true;
        
        const glCloseBtn = document.getElementById('modal-close');
        if (glCloseBtn) glCloseBtn.addEventListener('click', closeModal);
        
        const glModalOverlay = document.getElementById('modal-overlay');
        if (glModalOverlay) glModalOverlay.addEventListener('click', closeModal);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modalContainer.classList.contains('pointer-events-none')) {
                const galleryModal = document.getElementById('gallery-modal');
                if (galleryModal && !galleryModal.classList.contains('pointer-events-none')) {
                    return;
                }
                closeModal();
            }
        });
    }

    // Static modals
    root.querySelectorAll('[data-modal-target]').forEach(trigger => {
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        
        newTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            const url = newTrigger.getAttribute('data-modal-target');
            if (url) openModal(url);
        });
    });

    // Dynamic Ajax Modals (Projects)
    root.querySelectorAll('[data-project-id]').forEach(trigger => {
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);

        newTrigger.addEventListener('click', async (e) => {
            e.preventDefault();
            const projectId = newTrigger.getAttribute('data-project-id');
            const project = STATE.PROJECTS_DATA.find(p => p.id === projectId);
            
            if (project) {
                modalContainer.classList.remove('hidden');
                void modalContainer.offsetWidth;
                modalContainer.classList.remove('opacity-0', 'pointer-events-none');
                document.body.style.overflow = 'hidden';
                modalBody.innerHTML = defaultLoader;
                initIcons();
                
                setTimeout(() => {
                    modalWrapper.classList.remove('scale-95', 'opacity-0');
                    modalWrapper.classList.add('scale-100', 'opacity-100');
                }, 10);

                try {
                    const response = await fetch('Components/ModalProject.html');
                    if (!response.ok) throw new Error('Could not load modal template');
                    let template = await response.text();

                    const tagsHtml = project.tags.map(tag => 
                        `<span class="text-xs font-mono border border-light-border dark:border-dark-border px-4 py-2 text-gray-500 dark:text-gray-400">${tag}</span>`
                    ).join('');

                    const logrosHtml = project.logros.map(logro => 
                        `<li class="flex items-center gap-4"><i data-lucide="check" class="w-4 h-4 text-green-500"></i> ${logro}</li>`
                    ).join('');

                    const stackHtml = project.stack.map(tech => 
                        `<span class="px-3 py-1 bg-light-800 dark:bg-dark-900 border border-light-border dark:border-dark-border text-xs font-mono text-light-accent dark:text-gray-300">${tech}</span>`
                    ).join('');

                    const serviciosHtml = project.servicios.map(servicio => 
                        `<li>${servicio}</li>`
                    ).join('');

                    let urlHtml = '';
                    if (project.url) {
                        const linkText = STATE.currentLang === 'en' ? 'Live Project' : 'Ver Proyecto en Vivo';
                        urlHtml = `
                        <div class="border border-light-border dark:border-dark-border p-6 bg-light-800 dark:bg-dark-900 group relative overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-r from-light-accent/5 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <h3 class="text-xs font-mono tracking-widest uppercase text-light-muted dark:text-dark-muted mb-4 relative z-10">Deploy</h3>
                            <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="relative z-10 flex items-center justify-between text-light-accent dark:text-white group-hover:text-gray-500 transition-colors">
                                <span class="font-bold uppercase tracking-tighter truncate">${project.url.replace(/^https?:\/\//, '')}</span>
                                <i data-lucide="external-link" class="w-5 h-5"></i>
                            </a>
                        </div>`;
                    }

                    let btnGaleriaHtml = '';
                    if (project.imagenes && project.imagenes.length > 0) {
                        const btnText = STATE.currentLang === 'en' ? 'View System Gallery' : 'Ver Galería del Sistema';
                        btnGaleriaHtml = `
                        <div class="mt-8 border-t border-light-border dark:border-dark-border pt-8 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <i data-lucide="images" class="w-5 h-5 text-light-muted dark:text-dark-muted"></i>
                                <span class="text-xs font-mono uppercase tracking-[0.2em] text-light-muted dark:text-dark-muted">${project.imagenes.length} ${STATE.currentLang === 'en' ? 'Captures' : 'Capturas'}</span>
                            </div>
                            <button id="open-gallery-btn" class="px-6 py-3 border border-light-border dark:border-dark-border text-xs font-mono uppercase tracking-widest text-light-accent dark:text-white hover:bg-light-accent hover:text-light-900 dark:hover:bg-white dark:hover:text-black transition-colors flex items-center gap-2">
                                <i data-lucide="maximize" class="w-4 h-4"></i> ${btnText}
                            </button>
                        </div>`;
                    }

                    template = template.replace(/{{tags_html}}/g, tagsHtml);
                    template = template.replace(/{{titulo_modal}}/g, project.titulo_modal || '');
                    template = template.replace(/{{desafio}}/g, project.desafio || '');
                    template = template.replace(/{{solucion}}/g, project.solucion || '');
                    template = template.replace(/{{logros_html}}/g, logrosHtml);
                    template = template.replace(/{{stack_html}}/g, stackHtml);
                    template = template.replace(/{{servicios_html}}/g, serviciosHtml);
                    template = template.replace(/{{btn_galeria_html}}/g, btnGaleriaHtml);
                    template = template.replace(/{{url_html}}/g, urlHtml);

                    modalBody.innerHTML = template;
                    initIcons();

                    const galleryBtn = document.getElementById('open-gallery-btn');
                    if (galleryBtn) {
                        galleryBtn.addEventListener('click', () => openGalleryModal(project));
                    }

                } catch (error) {
                    console.error('Error filling project modal:', error);
                    modalBody.innerHTML = `<div class="p-8 text-center text-red-500 font-mono">Error al cargar datos dinámicos.</div>`;
                }
            }
        });
    });
}

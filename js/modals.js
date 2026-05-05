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

                    let btnGaleriaHtml = '';
                    let totalItems = (project.imagenes ? project.imagenes.length : 0);
                    if (project.videos && Array.isArray(project.videos)) {
                        totalItems += project.videos.length;
                    } else {
                        totalItems += Object.keys(project).filter(k => k.startsWith('video') && project[k]).length;
                    }

                    if (totalItems > 0) {
                        const btnText = STATE.currentLang === 'en' ? 'OPEN SYSTEM GALLERY' : 'ABRIR GALERÍA SISTEMA';
                        btnGaleriaHtml = `
                        <button id="open-gallery-btn" class="w-full flex items-center justify-between px-5 py-3.5 border border-light-border dark:border-dark-border text-[10px] font-mono uppercase tracking-[0.2em] text-light-accent dark:text-white hover:bg-light-accent hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-[0.98] group">
                            <div class="flex items-center">
                                <i data-lucide="maximize-2" class="w-3.5 h-3.5 mr-2"></i>
                                <span>${btnText}</span>
                            </div>
                            <span class="opacity-40 font-bold">(${totalItems})</span>
                        </button>`;
                    }

                    let urlHtml = '';
                    if (project.url) {
                        const deployLabel = STATE.currentLang === 'en' ? 'LIVE DEPLOY' : 'SISTEMA EN VIVO';
                        urlHtml = `
                        <div class="electric-link-container" style="position: relative; padding: 1.25rem; background: #000; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: visible; min-height: 100px; border: 1px solid rgba(34, 197, 94, 0.3); gap: 0.75rem;">
                            <canvas id="lightning-canvas" style="position: absolute; inset: -30px; width: calc(100% + 60px); height: calc(100% + 60px); pointer-events: none; z-index: 5;"></canvas>
                            
                            <div style="position: relative; z-index: 10; text-align: center; width: 100%;">
                                <span style="display: block; font-family: 'JetBrains Mono', monospace; font-size: 8px; color: #4ade80; letter-spacing: 0.3em; margin-bottom: 0.25rem; opacity: 0.6;">${deployLabel}</span>
                                <a href="${project.url}" target="_blank" rel="noopener noreferrer" style="color: #fff; font-family: 'Syncopate', sans-serif; font-weight: 700; font-size: 0.8rem; text-decoration: none; transition: all 0.3s; letter-spacing: -0.02em; display: block; word-break: break-all; max-width: 100%;">
                                    ${project.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                </a>
                            </div>

                            <a href="${project.url}" target="_blank" rel="noopener noreferrer" style="position: relative; z-index: 10; width: 100%; text-align: center; color: #4ade80; font-family: 'JetBrains Mono', monospace; font-size: 9px; text-decoration: none; font-weight: bold; border: 1px solid rgba(74, 222, 128, 0.4); padding: 8px; border-radius: 6px; transition: all 0.3s; background: rgba(74, 222, 128, 0.05);" onmouseover="this.style.background='#4ade80'; this.style.color='#000'; this.style.boxShadow='0 0 20px #4ade80'" onmouseout="this.style.background='rgba(74, 222, 128, 0.05)'; this.style.color='#4ade80'; this.style.boxShadow='none'">
                                Ver &gt;
                            </a>
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

                    // Inicializar el efecto de rayos casi reales
                    initElectricLinkEffect();

                } catch (error) {
                    console.error('Error filling project modal:', error);
                    modalBody.innerHTML = `<div class="p-8 text-center text-red-500 font-mono">Error al cargar datos dinámicos.</div>`;
                }
            }
        });
    });
}

/**
 * Crea una animación de rayos y chispas realistas sobre un canvas.
 */
function initElectricLinkEffect() {
    const canvas = document.getElementById('lightning-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    const resize = () => {
        const rect = canvas.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
    };
    window.addEventListener('resize', resize);
    resize();

    let bolts = [];
    let sparks = [];

    class Spark {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 10;
            this.vy = (Math.random() - 0.5) * 10;
            this.life = 1.0;
            this.decay = 0.02 + Math.random() * 0.05;
            this.size = 1 + Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.2; // Gravity
            this.life -= this.decay;
        }
        draw() {
            ctx.fillStyle = `rgba(74, 222, 128, ${this.life})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createBolt() {
        const margin = 60;
        const x1 = margin + Math.random() * (width - margin * 2);
        const y1 = margin + Math.random() * (height - margin * 2);
        const x2 = x1 + (Math.random() - 0.5) * 100;
        const y2 = y1 + (Math.random() - 0.5) * 100;
        
        let segments = [];
        let curX = x1, curY = y1;
        const parts = 10;
        
        for (let i = 0; i < parts; i++) {
            const tx = x1 + (x2 - x1) * (i / parts) + (Math.random() - 0.5) * 30;
            const ty = y1 + (y2 - y1) * (i / parts) + (Math.random() - 0.5) * 30;
            segments.push({ x1: curX, y1: curY, x2: tx, y2: ty });
            curX = tx; curY = ty;
            
            if (Math.random() > 0.8) { // Chispas en el impacto del rayo
                for(let s=0; s<5; s++) sparks.push(new Spark(tx, ty));
            }
        }
        return { segments, life: 1.0, decay: 0.1 + Math.random() * 0.2 };
    }

    function animate() {
        if (!document.getElementById('lightning-canvas')) return;
        
        ctx.clearRect(0, 0, width, height);
        
        if (Math.random() > 0.92) bolts.push(createBolt());

        ctx.lineCap = 'round';
        
        bolts.forEach((bolt, index) => {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#4ade80';
            ctx.strokeStyle = `rgba(255, 255, 255, ${bolt.life})`;
            ctx.lineWidth = 2 * bolt.life;
            
            ctx.beginPath();
            bolt.segments.forEach(s => {
                ctx.moveTo(s.x1, s.y1);
                ctx.lineTo(s.x2, s.y2);
            });
            ctx.stroke();
            
            bolt.life -= bolt.decay;
            if (bolt.life <= 0) bolts.splice(index, 1);
        });

        ctx.shadowBlur = 0;
        sparks.forEach((spark, index) => {
            spark.update();
            spark.draw();
            if (spark.life <= 0) sparks.splice(index, 1);
        });

        requestAnimationFrame(animate);
    }

    animate();
}

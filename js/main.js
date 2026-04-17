/**
 * js/main.js
 * 
 * ============================================
 * GLOBAL CONFIGURATION
 * ============================================
 */
const BRAND_CONFIG = {
    nombre_marca: "HieysoN",
    hero_phrases: [
        { title: "Tecnología de última generación para negocios modernos.", subtitle: "Creamos sistemas digitales con Inteligencia Artificial para automatizar tus tareas diarias. Ahorra tiempo, dinero y haz que tu negocio trabaje en piloto automático." },
        { title: "Ecosistemas digitales diseñados para escalar.", subtitle: "Transformamos la forma en que operas usando software a la medida. Olvídate del trabajo manual rutinario y enfócate en hacer crecer tu empresa." },
        { title: "Automatización inteligente que acelera tus metas.", subtitle: "Conectamos herramientas como WhatsApp a tus bases de datos para crear asistentes en línea que atienden a tus clientes las 24 horas del día sin errores." }
    ],
    slogan: "Software Inteligente",
    subtitulo: "Diseñamos plataformas digitales y sistemas automatizados que tus usuarios amarán. Integramos IA y flujos con n8n.",
    email: "contact@hieyson.com",
    url_linkedin: "https://www.linkedin.com/in/nosyeih-dev/",
    url_github: "https://github.com/NosyeihDev",
};

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Icons Initialization 
    if(typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Data Bindings
    document.querySelectorAll('[data-bind="nombre_marca"]').forEach(el => el.textContent = BRAND_CONFIG.nombre_marca);
    document.querySelectorAll('[data-bind="slogan"]').forEach(el => el.textContent = BRAND_CONFIG.slogan);
    document.querySelectorAll('[data-bind="subtitulo"]').forEach(el => el.textContent = BRAND_CONFIG.subtitulo);
    document.querySelectorAll('[data-bind="email"]').forEach(el => el.textContent = BRAND_CONFIG.email);
    document.querySelectorAll('[data-bind-href="email"]').forEach(el => el.href = `mailto:${BRAND_CONFIG.email}`);
    document.querySelectorAll('[data-bind-href="linkedin"]').forEach(el => el.href = BRAND_CONFIG.url_linkedin);
    document.querySelectorAll('[data-bind-href="github"]').forEach(el => el.href = BRAND_CONFIG.url_github);

    // 3. Navbar scroll & Mobile Menu
    const navbar = document.getElementById('navbar');
    const mobileBtn = document.getElementById('mobile-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Add I18n initialization
    initI18n();
    
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });

    // 4. GSAP Scroll Animations
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from(".gsap-hero", {
            y: 40,
            opacity: 0,
            duration: 2.5,
            stagger: 0.4,
            ease: "expo.out",
            delay: 0.2
        });

        gsap.utils.toArray('.gsap-scroll').forEach(elem => {
            gsap.from(elem, {
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                },
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: "power2.out"
            });
        });
        
        // Start typewriter after hero animations (delay ~1.5s)
        setTimeout(initTypewriter, 1500);
    } else {
        // Fallback if GSAP is not loaded
        initTypewriter();
    }

    // 5. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const darkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');
    const lightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');

    function updateIcons() {
        if (document.documentElement.classList.contains('dark')) {
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
            darkIconMobile.classList.add('hidden');
            lightIconMobile.classList.remove('hidden');
        } else {
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
            lightIconMobile.classList.add('hidden');
            darkIconMobile.classList.remove('hidden');
        }
    }

    // Call initially
    updateIcons();
    updateFaviconAndLogo();

    function toggleTheme() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
        updateIcons();
        updateFaviconAndLogo();
    }

    themeToggleBtn.addEventListener('click', toggleTheme);
    themeToggleMobileBtn.addEventListener('click', toggleTheme);

    // 6. Neural Network AI Background (Canvas)
    initNeuralNetwork();

    // 7. Dynamic AJAX Modal Logic
    initDynamicModals();

    // 8. Load JSON Data (Projects, Clients & Ratings)
    loadProjectsData();
    loadClientsData();
    loadRatingsData();
});

let currentLang = localStorage.getItem('site-lang') || 'es';

/**
 * ============================================
 * I18N & THEME DYNAMIC LOGIC
 * ============================================
 */
async function initI18n() {
    // Setup toggle buttons if available
    const langBtn = document.getElementById('lang-toggle');
    if(langBtn) {
        langBtn.textContent = currentLang === 'en' ? 'ES' : 'EN';
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'es' : 'en';
            localStorage.setItem('site-lang', currentLang);
            langBtn.textContent = currentLang === 'en' ? 'ES' : 'EN';
            applyTranslations();
            loadProjectsData(); // Reload projects in new lang
        });
    }
    await applyTranslations();
}

async function applyTranslations() {
    try {
        const response = await fetch(`jsons/locales/${currentLang}.json`);
        if(!response.ok) return;
        const translations = await response.json();
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if(translations[key]) {
                // If it's an input placeholder
                if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[key];
                    // Find corresponding label if exists
                    const label = el.parentElement.querySelector('label');
                    if(label) label.textContent = translations[key];
                } else if(el.id === 'tw-slogan' || el.id === 'typewriter-text' || el.id === 'tw-sub') {
                    // Handled by typewriter logic natively maybe?
                    // Restart typewriter to ensure language applies
                } else {
                    el.textContent = translations[key];
                }
            }
        });
        
        // Refresh specific configs
        if(translations['hero.tagline']) BRAND_CONFIG.slogan = translations['hero.tagline'];
        
        if(translations['hero.title_1']) {
            BRAND_CONFIG.hero_phrases[0].title = translations['hero.title_1'];
            BRAND_CONFIG.hero_phrases[0].subtitle = translations['hero.subtitle_1'];
            
            BRAND_CONFIG.hero_phrases[1].title = translations['hero.title_2'];
            BRAND_CONFIG.hero_phrases[1].subtitle = translations['hero.subtitle_2'];
            
            BRAND_CONFIG.hero_phrases[2].title = translations['hero.title_3'];
            BRAND_CONFIG.hero_phrases[2].subtitle = translations['hero.subtitle_3'];
        }

        if(translations['expertise.desc']) BRAND_CONFIG.subtitulo = translations['expertise.desc'];
        
        // Force typewriter restart to translate
        initTypewriter();

    } catch (e) {
        console.error("I18n error", e);
    }
}

function updateFaviconAndLogo() {
    const isDark = document.documentElement.classList.contains('dark');
    const folder = isDark ? 'white' : 'black';
    const logoImg = document.getElementById('brand-logo');
    
    // Update logo in navbar
    if (logoImg) {
        logoImg.src = `img/logo/${folder}/favicon-96x96.png`;
    }

    // Update favicons
    const iconLinks = [
        { selector: 'link[rel="icon"][sizes="96x96"]', filename: 'favicon-96x96.png' },
        { selector: 'link[rel="icon"][type="image/svg+xml"]', filename: 'favicon.svg' },
        { selector: 'link[rel="shortcut icon"]', filename: 'favicon.ico' },
        { selector: 'link[rel="apple-touch-icon"]', filename: 'apple-touch-icon.png' }
    ];

    iconLinks.forEach(linkObj => {
        const el = document.querySelector(linkObj.selector);
        if (el) el.href = `img/logo/${folder}/${linkObj.filename}`;
    });
}

/**
 * ============================================
 * JSON DATA LOADING LOGIC
 * ============================================
 */
let PROJECTS_DATA = [];

async function loadProjectsData() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    try {
        // Fetch projects data according to language
        const jsonFile = currentLang === 'en' ? 'jsons/Proyectos_en.json' : 'jsons/Proyectos.json';
        const jsonResponse = await fetch(jsonFile);
        if (!jsonResponse.ok) throw new Error('Error loading Projects JSON');
        const data = await jsonResponse.json();
        PROJECTS_DATA = data.proyectos || [];

        // Fetch HTML Template
        const tplResponse = await fetch('Components/Projects.html');
        if (!tplResponse.ok) throw new Error('Error loading Projects Template');
        const templateHtml = await tplResponse.text();

        let projectsHtml = '';
        
        PROJECTS_DATA.forEach(project => {
            let itemHtml = templateHtml;
            
            // Replace variables
            itemHtml = itemHtml.replace(/{{id}}/g, project.id || '');
            itemHtml = itemHtml.replace(/{{categoria}}/g, project.categoria || '');
            itemHtml = itemHtml.replace(/{{tecnologias_listado}}/g, project.tecnologias_listado || '');
            itemHtml = itemHtml.replace(/{{titulo_listado}}/g, project.titulo_listado || '');
            itemHtml = itemHtml.replace(/{{descripcion_listado}}/g, project.descripcion_listado || '');
            
            const firstImg = project.imagenes && project.imagenes.length > 0 ? project.imagenes[0] : '';
            itemHtml = itemHtml.replace(/{{project_bg_image}}/g, firstImg);

            projectsHtml += itemHtml;
        });

        projectsContainer.innerHTML = projectsHtml;

        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({
                root: projectsContainer
            });
        }

        // Refresh GSAP ScrollTrigger since we added new elements
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
            
            // Re-apply animations to new elements if they have the gsap-scroll class
            gsap.utils.toArray('#projects-container .gsap-scroll').forEach(elem => {
                gsap.from(elem, {
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                    },
                    y: 40,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power2.out"
                });
            });
        }

        // Re-initialize modal listeners for the new buttons
        initDynamicModals();

    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}

async function loadClientsData() {
    const clientsTrack = document.getElementById('clients-track');
    if (!clientsTrack) return;

    try {
        const response = await fetch('jsons/Clientes.json');
        if (!response.ok) throw new Error('Error loading Clients');
        const data = await response.json();
        const clients = data.clientes || [];

        // Fetch HTML Template
        const tplResponse = await fetch('Components/Client.html');
        if (!tplResponse.ok) throw new Error('Error loading Client Template');
        const templateHtml = await tplResponse.text();

        let htmlContent = '';
        clients.forEach(client => {
            let itemHtml = templateHtml;
            
            // Fallback para iconos
            const imgSrc = client.Icono || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.Compañia)}&background=random&color=fff&size=200&font-size=0.4&format=svg`;
            
            itemHtml = itemHtml.replace(/{{url}}/g, client.url || '#');
            itemHtml = itemHtml.replace(/{{Icono}}/g, imgSrc);
            itemHtml = itemHtml.replace(/{{Compañia}}/g, client.Compañia || '');

            htmlContent += itemHtml;
        });

        // Duplicamos el contenido para el efecto de marquee infinito
        clientsTrack.innerHTML = htmlContent + htmlContent;

    } catch (error) {
        console.error('Failed to load clients:', error);
    }
}

async function loadRatingsData() {
    const ratingsGrid = document.getElementById('ratings-grid');
    if (!ratingsGrid) return;

    try {
        const jsonResponse = await fetch('jsons/Calificacion.json');
        if (!jsonResponse.ok) throw new Error('Error loading Ratings JSON');
        const data = await jsonResponse.json();
        const comentarios = data.comentarios || [];

        const tplResponse = await fetch('Components/Rating.html');
        if (!tplResponse.ok) throw new Error('Error loading Rating Template');
        const templateHtml = await tplResponse.text();

        let gridHtml = '';
        comentarios.forEach(item => {
            let itemHtml = templateHtml;
            
            // Reemplazar variables básicas
            itemHtml = itemHtml.replace(/{{mensaje}}/g, item.mensaje || '');
            itemHtml = itemHtml.replace(/{{nombre}}/g, item.nombre || '');
            itemHtml = itemHtml.replace(/{{email}}/g, item.email || '');
            itemHtml = itemHtml.replace(/{{Compañia}}/g, item.Compañia || '');
            
            // Iniciales
            const initials = (item.nombre || 'U N').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            itemHtml = itemHtml.replace(/{{nombre_iniciales}}/g, initials);

            // Foto / Avatar
            if (item.foto) {
                const imgHtml = `<img src="${item.foto}" alt="${item.nombre}" class="w-full h-full object-cover">`;
                itemHtml = itemHtml.replace(/<span class="initials">.+?<\/span>/g, imgHtml);
            }

            // Estrellas
            let starsHtml = '';
            const rating = parseInt(item.rating) || 5;
            for(let i=1; i<=5; i++) {
                const colorClass = i <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600 fill-current';
                starsHtml += `<svg class="w-4 h-4 ${colorClass}" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
            }
            itemHtml = itemHtml.replace(/<!-- Las estrellas se inyectarán por JS según el rating -->/g, starsHtml);

            gridHtml += itemHtml;
        });

        ratingsGrid.innerHTML = gridHtml + gridHtml;

        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ root: ratingsGrid });
        }

    } catch (error) {
        console.error('Failed to load ratings:', error);
    }
}

/**
 * ============================================
 * DYNAMIC AJAX MODALS
 * ============================================
 */
function initDynamicModals() {
    const modalContainer = document.getElementById('global-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalWrapper = document.getElementById('modal-content-wrapper');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.getElementById('modal-close');
    const defaultLoader = `
        <div class="flex items-center justify-center h-full min-h-[300px]">
            <i data-lucide="loader-2" class="w-8 h-8 text-light-muted dark:text-dark-muted animate-spin"></i>
        </div>
    `;

    // Function to Open Modal and fetch content
    async function openModal(url) {
        // Show Modal Container
        modalContainer.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Reset to loader
        modalBody.innerHTML = defaultLoader;
        if(typeof lucide !== 'undefined') lucide.createIcons();

        // Animate in
        setTimeout(() => {
            modalWrapper.classList.remove('scale-95', 'opacity-0');
            modalWrapper.classList.add('scale-100', 'opacity-100');
        }, 10);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const html = await response.text();
            
            // Inject HTML
            modalBody.innerHTML = html;

            // Re-initialize any icons inside the new HTML
            if(typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // (Optional) Re-trigger GSAP animations if any inside the modal
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

    // Function to Close Modal
    function closeModal() {
        modalWrapper.classList.remove('scale-100', 'opacity-100');
        modalWrapper.classList.add('scale-95', 'opacity-0');
        
        setTimeout(() => {
            modalContainer.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = ''; // Restore background scrolling
            modalBody.innerHTML = ''; // Clear memory
        }, 300); // Wait for transition
    }

    // Attach Event Listeners to Triggers
    // Standard modal targets (static URLs)
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        // Remove existing listener to avoid duplication if called multiple times
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        
        newTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            const url = newTrigger.getAttribute('data-modal-target');
            if (url) openModal(url);
        });
    });

    // Project specific dynamic modals
    document.querySelectorAll('[data-project-id]').forEach(trigger => {
        // Clone to reset listeners
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);

        newTrigger.addEventListener('click', async (e) => {
            e.preventDefault();
            const projectId = newTrigger.getAttribute('data-project-id');
            const project = PROJECTS_DATA.find(p => p.id === projectId);
            
            if (project) {
                // Open modal with loader
                modalContainer.classList.remove('opacity-0', 'pointer-events-none');
                document.body.style.overflow = 'hidden';
                modalBody.innerHTML = defaultLoader;
                if(typeof lucide !== 'undefined') lucide.createIcons();
                
                setTimeout(() => {
                    modalWrapper.classList.remove('scale-95', 'opacity-0');
                    modalWrapper.classList.add('scale-100', 'opacity-100');
                }, 10);

                try {
                    // Fetch generic modal template
                    const response = await fetch('Components/ModalProject.html');
                    if (!response.ok) throw new Error('Could not load modal template');
                    let template = await response.text();

                    // Generate Dynamic Parts
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

                    // Logic for Web URL Button
                    let urlHtml = '';
                    if (project.url) {
                        const linkText = currentLang === 'en' ? 'Live Project' : 'Ver Proyecto en Vivo';
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

                    // Logic for Gallery Button
                    let btnGaleriaHtml = '';
                    if (project.imagenes && project.imagenes.length > 0) {
                        const btnText = currentLang === 'en' ? 'View System Gallery' : 'Ver Galería del Sistema';
                        btnGaleriaHtml = `
                        <div class="mt-8 border-t border-light-border dark:border-dark-border pt-8 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <i data-lucide="images" class="w-5 h-5 text-light-muted dark:text-dark-muted"></i>
                                <span class="text-xs font-mono uppercase tracking-[0.2em] text-light-muted dark:text-dark-muted">${project.imagenes.length} ${currentLang === 'en' ? 'Captures' : 'Capturas'}</span>
                            </div>
                            <button id="open-gallery-btn" class="px-6 py-3 border border-light-border dark:border-dark-border text-xs font-mono uppercase tracking-widest text-light-accent dark:text-white hover:bg-light-accent hover:text-light-900 dark:hover:bg-white dark:hover:text-black transition-colors flex items-center gap-2">
                                <i data-lucide="maximize" class="w-4 h-4"></i> ${btnText}
                            </button>
                        </div>`;
                    }

                    // Replace in template
                    template = template.replace(/{{tags_html}}/g, tagsHtml);
                    template = template.replace(/{{titulo_modal}}/g, project.titulo_modal || '');
                    template = template.replace(/{{desafio}}/g, project.desafio || '');
                    template = template.replace(/{{solucion}}/g, project.solucion || '');
                    template = template.replace(/{{logros_html}}/g, logrosHtml);
                    template = template.replace(/{{stack_html}}/g, stackHtml);
                    template = template.replace(/{{servicios_html}}/g, serviciosHtml);
                    template = template.replace(/{{btn_galeria_html}}/g, btnGaleriaHtml);
                    template = template.replace(/{{url_html}}/g, urlHtml);

                    // Inject
                    modalBody.innerHTML = template;
                    if(typeof lucide !== 'undefined') lucide.createIcons();

                    // Wire Gallery Button
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

    // Close logic
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalContainer.classList.contains('pointer-events-none')) {
            closeModal();
        }
    });

}

/**
 * ============================================
 * GALLERY MODAL SPECIFIC LOGIC
 * ============================================
 */
function openGalleryModal(project) {
    const galleryModal = document.getElementById('gallery-modal');
    if (!galleryModal) return;

    const galleryBody = document.getElementById('gallery-body');
    const galleryTitle = document.getElementById('gallery-title');
    const galleryCounter = document.getElementById('gallery-counter');

    // Populate images
    if (project.imagenes && project.imagenes.length > 0) {
        galleryBody.innerHTML = project.imagenes.map((imgSrc, i) => `
            <div class="snap-center shrink-0 w-[95%] md:w-[85%] lg:w-[75%] h-[60vh] md:h-[75vh] relative flex items-center justify-center pointer-events-none">
                <img src="${imgSrc}" loading="lazy" class="max-w-full max-h-full object-contain pointer-events-auto shadow-2xl border border-white/10" />
            </div>
        `).join('');
        
        galleryTitle.textContent = project.titulo_modal || 'Galería';
        galleryCounter.textContent = `1 / ${project.imagenes.length}`;
        
        // Add scroll listener for counter
        galleryBody.addEventListener('scroll', () => {
            const index = Math.round(galleryBody.scrollLeft / galleryBody.clientWidth);
            galleryCounter.textContent = `${Math.min(index + 1, project.imagenes.length)} / ${project.imagenes.length}`;
        });
    }

    // Show modal
    galleryModal.classList.remove('opacity-0', 'pointer-events-none');
    
    // Add close logic
    const closeGallery = () => {
        galleryModal.classList.add('opacity-0', 'pointer-events-none');
        galleryBody.innerHTML = ''; // Clean up
    };

    document.getElementById('gallery-close').onclick = closeGallery;
    document.getElementById('gallery-overlay').onclick = closeGallery;

    // Esc closing
    document.addEventListener('keydown', function escListener(e) {
        if (e.key === 'Escape') {
            closeGallery();
            document.removeEventListener('keydown', escListener);
        }
    });
}

/**
 * ============================================
 * TYPEWRITER EFFECT
 * ============================================
 */
function initTypewriter() {
    const mainTextEl = document.getElementById('typewriter-text');
    const subEl = document.getElementById('tw-sub');
    
    if (!mainTextEl || !subEl) return;
    
    // Clear global loop to prevent overlapping
    window.twActive = (window.twActive || 0) + 1;
    const currentLoopId = window.twActive;

    // Clear elements
    mainTextEl.textContent = "";
    subEl.textContent = "";

    const subText = BRAND_CONFIG.subtitulo;

    function createCursor() {
        const cursor = document.createElement('span');
        cursor.className = "inline-block w-[3px] h-[1em] animate-rgb-cursor ml-1 align-middle opacity-80";
        return cursor;
    }

    const cursorMain = createCursor();
    const cursorSub = createCursor();

    function typeText(element, text, cursorEl, minSpeed, maxSpeed) {
        return new Promise(resolve => {
            element.appendChild(cursorEl);
            let textNode = document.createTextNode("");
            element.insertBefore(textNode, cursorEl);
            let i = 0;
            
            function type() {
                if (window.twActive !== currentLoopId) return;
                if (i < text.length) {
                    textNode.nodeValue += text.charAt(i);
                    i++;
                    setTimeout(type, Math.random() * (maxSpeed - minSpeed) + minSpeed);
                } else {
                    resolve();
                }
            }
            type();
        });
    }

    function deleteText(element, cursorEl, minSpeed, maxSpeed) {
        return new Promise(resolve => {
            element.appendChild(cursorEl);
            let textNode = null;
            for (let i = 0; i < element.childNodes.length; i++) {
                if (element.childNodes[i].nodeType === 3) {
                    textNode = element.childNodes[i];
                }
            }
            
            function del() {
                if (window.twActive !== currentLoopId) return;
                if (textNode && textNode.nodeValue.length > 0) {
                    textNode.nodeValue = textNode.nodeValue.slice(0, -1);
                    setTimeout(del, Math.random() * (maxSpeed - minSpeed) + minSpeed);
                } else {
                    resolve();
                }
            }
            del();
        });
    }

    async function runTypewriterSequence() {
        let currentPhraseIndex = 0;
        
        while(window.twActive === currentLoopId) {
            const phrase = BRAND_CONFIG.hero_phrases[currentPhraseIndex];
            
            // Fast typing (simultaneously)
            await Promise.all([
                typeText(mainTextEl, phrase.title, cursorMain, 8, 20),
                typeText(subEl, phrase.subtitle, cursorSub, 2, 8)
            ]);

            // Wait ~5-6 seconds
            await new Promise(r => setTimeout(r, 6000));
            if (window.twActive !== currentLoopId) break;

            // Fast deleting
            await Promise.all([
                deleteText(mainTextEl, cursorMain, 3, 8),
                deleteText(subEl, cursorSub, 1, 3)
            ]);
            
            if (window.twActive !== currentLoopId) break;

            currentPhraseIndex = (currentPhraseIndex + 1) % BRAND_CONFIG.hero_phrases.length;
        }
    }

    runTypewriterSequence();
}

/**
 * ============================================
 * NEURAL NETWORK INTERACTIVE CANVAS BACKGROUND
 * ============================================
 */
function initNeuralNetwork() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    const connectionDistance = 150; 
    const mouseRadius = 200; 
    
    let mouse = {
        x: null,
        y: null,
        radius: mouseRadius
    };

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }
    
    window.addEventListener('resize', resizeCanvas);

    // Theme color helper for canvas drawing
    const getThemeColors = () => {
        const isDark = document.documentElement.classList.contains('dark');
        return {
            node: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.8)',
            line: isDark ? '255, 255, 255' : '0, 0, 0',
            lineOpacityMult: isDark ? 0.15 : 0.4,
            mouseLine: isDark ? '150, 200, 255' : '15, 23, 42', // Dark slate blue for emphasis in light mode
            mouseLineOpacityMult: isDark ? 0.4 : 0.6
        };
    };

    class Particle {
        constructor(x, y, dx, dy, size) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.size = size;
            this.baseX = this.x;
            this.baseY = this.y;
        }

        draw(colors) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = colors.node;
            ctx.fill();
        }

        update(colors) {
            // Rebotar en bordes
            if (this.x > width || this.x < 0) this.dx = -this.dx;
            if (this.y > height || this.y < 0) this.dy = -this.dy;

            // Movimiento autónomo
            this.x += this.dx;
            this.y += this.dy;

            // Interacción de mouse: Atracción / Repulsión AI
            if (mouse.x && mouse.y) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const moveX = forceDirectionX * 1;
                    const moveY = forceDirectionY * 1;

                    this.x += moveX;
                    this.y += moveY;
                }
            }
            
            this.draw(colors);
        }
    }

    function initParticles() {
        particles = [];
        const numParticles = (width * height) / 12000; 
        
        for (let i = 0; i < numParticles; i++) {
            let size = (Math.random() * 1.5) + 0.5;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let dx = (Math.random() - 0.5) * 0.4;
            let dy = (Math.random() - 0.5) * 0.4;
            
            particles.push(new Particle(x, y, dx, dy, size));
        }
    }

    function connectParticles(colors) {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = dx * dx + dy * dy;

                if (distance < (connectionDistance * connectionDistance)) {
                    opacityValue = 1 - (distance / (connectionDistance * connectionDistance));
                    ctx.strokeStyle = `rgba(${colors.line}, ${opacityValue * colors.lineOpacityMult})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
            
            if (mouse.x && mouse.y) {
                let mx = particles[a].x - mouse.x;
                let my = particles[a].y - mouse.y;
                let mDistance = mx * mx + my * my;
                
                if (mDistance < (mouse.radius * mouse.radius)) {
                    opacityValue = 1 - (mDistance / (mouse.radius * mouse.radius));
                    ctx.strokeStyle = `rgba(${colors.mouseLine}, ${opacityValue * colors.mouseLineOpacityMult})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        const colors = getThemeColors();
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(colors);
        }
        connectParticles(colors);
    }

    resizeCanvas();
    animate();
}

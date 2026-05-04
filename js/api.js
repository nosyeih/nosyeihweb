/**
 * js/api.js
 * Peticiones asíncronas para cargar JSON y Componentes HTML.
 */

import { STATE, BRAND_CONFIG, setProjectsData, setLanguage } from './config.js';
import { initTypewriter, initIcons } from './utils.js';
import { initDynamicModals } from './modals.js';

export async function initI18n() {
    const langBtn = document.getElementById('lang-toggle');
    if(langBtn) {
        langBtn.textContent = STATE.currentLang === 'en' ? 'ES' : 'EN';
        langBtn.addEventListener('click', () => {
            const nextLang = STATE.currentLang === 'en' ? 'es' : 'en';
            setLanguage(nextLang);
            langBtn.textContent = STATE.currentLang === 'en' ? 'ES' : 'EN';
            applyTranslations();
            loadProjectsData(); 
        });
    }
    await applyTranslations();
}

export async function applyTranslations() {
    try {
        const response = await fetch(`jsons/locales/${STATE.currentLang}.json`);
        if(!response.ok) return;
        const translations = await response.json();
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if(translations[key]) {
                if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[key];
                    const label = el.parentElement.querySelector('label');
                    if(label) label.textContent = translations[key];
                } else if(el.id === 'tw-slogan' || el.id === 'typewriter-text' || el.id === 'tw-sub') {
                    // Typewriter will pick it up
                } else {
                    el.textContent = translations[key];
                }
            }
        });
        
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
        
        const emailToUse = STATE.currentLang === 'en' ? BRAND_CONFIG.email2 : BRAND_CONFIG.email1;
        document.querySelectorAll('[data-bind="email"]').forEach(el => el.textContent = emailToUse);
        document.querySelectorAll('[data-bind-href="email"]').forEach(el => el.href = `mailto:${emailToUse}`);

        initTypewriter();

    } catch (e) {
        console.error("I18n error", e);
    }
}

export async function loadProjectsData() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    try {
        const jsonFile = STATE.currentLang === 'en' ? 'jsons/Proyectos_en.json' : 'jsons/Proyectos.json';
        const jsonResponse = await fetch(jsonFile);
        if (!jsonResponse.ok) throw new Error('Error loading Projects JSON');
        const data = await jsonResponse.json();
        setProjectsData(data.proyectos || []);

        const tplResponse = await fetch('Components/Projects.html');
        if (!tplResponse.ok) throw new Error('Error loading Projects Template');
        const templateHtml = await tplResponse.text();

        let projectsHtml = '';
        
        STATE.PROJECTS_DATA.forEach(project => {
            let itemHtml = templateHtml;
            
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

        initIcons(projectsContainer);

        if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
            ScrollTrigger.refresh();
            gsap.utils.toArray('#projects-container .gsap-scroll').forEach(elem => {
                gsap.fromTo(elem, 
                    { y: 40, opacity: 0 },
                    {
                        scrollTrigger: { trigger: elem, start: "top 85%" },
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: "power2.out"
                    }
                );
            });
        }

        initDynamicModals();

    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}

export async function loadClientsData() {
    const clientsTrack = document.getElementById('clients-track');
    if (!clientsTrack) return;

    try {
        const response = await fetch('jsons/Clientes.json');
        if (!response.ok) throw new Error('Error loading Clients');
        const data = await response.json();
        const clients = data.clientes || [];

        const tplResponse = await fetch('Components/Client.html');
        if (!tplResponse.ok) throw new Error('Error loading Client Template');
        const templateHtml = await tplResponse.text();

        let htmlContent = '';
        clients.forEach(client => {
            let itemHtml = templateHtml;
            
            const imgSrc = client.Icono || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.Compañia)}&background=random&color=fff&size=200&font-size=0.4&format=svg`;
            const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(client.Compañia)}&background=random&color=fff&size=200&font-size=0.4&format=svg`;
            
            itemHtml = itemHtml.replace(/{{url}}/g, client.url || '#');
            itemHtml = itemHtml.replace(/{{Icono}}/g, imgSrc);
            // Inyectamos el evento onerror para que las imagenes rotas retomen el fallback
            itemHtml = itemHtml.replace(/<img src="/, `<img onerror="this.onerror=null; this.src='${fallbackSrc}'" src="`);
            itemHtml = itemHtml.replace(/{{Compañia}}/g, client.Compañia || '');

            htmlContent += itemHtml;
        });

        clientsTrack.innerHTML = htmlContent + htmlContent;

    } catch (error) {
        console.error('Failed to load clients:', error);
    }
}

export async function loadRatingsData() {
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
            
            itemHtml = itemHtml.replace(/{{mensaje}}/g, item.mensaje || '');
            itemHtml = itemHtml.replace(/{{nombre}}/g, item.nombre || '');
            itemHtml = itemHtml.replace(/{{email}}/g, item.email || '');
            itemHtml = itemHtml.replace(/{{Compañia}}/g, item.Compañia || '');
            
            const initials = (item.nombre || 'U N').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            itemHtml = itemHtml.replace(/{{nombre_iniciales}}/g, initials);

            if (item.foto) {
                const imgHtml = `<img src="${item.foto}" alt="${item.nombre}" class="w-full h-full object-cover">`;
                itemHtml = itemHtml.replace(/<span class="initials">.+?<\/span>/g, imgHtml);
            }

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
        initIcons(ratingsGrid);

    } catch (error) {
        console.error('Failed to load ratings:', error);
    }
}

/**
 * js/main.js
 * Modulo principal e inicializador de la aplicación (Orquestador).
 */

import { BRAND_CONFIG, STATE } from './config.js';
import { initIcons, initNeuralNetwork, updateThemeIcons, updateFaviconAndLogo, initButtonSparks } from './utils.js';
import { initI18n, loadProjectsData, loadClientsData, loadRatingsData } from './api.js';
import { initDynamicModals } from './modals.js';

document.addEventListener("DOMContentLoaded", async () => {
    
    // 1. Icons Initialization 
    initIcons();

    // 2. Data Bindings (Elementos Estáticos)
    document.querySelectorAll('[data-bind="nombre_marca"]').forEach(el => el.textContent = BRAND_CONFIG.nombre_marca);
    document.querySelectorAll('[data-bind="email1"]').forEach(el => el.textContent = BRAND_CONFIG.email1);
    const socialNetworks = [
        { key: 'linkedin', url: BRAND_CONFIG.url_linkedin },
        { key: 'github', url: BRAND_CONFIG.url_github },
        { key: 'youtube', url: BRAND_CONFIG.url_youtube },
        { key: 'instagram', url: BRAND_CONFIG.url_instagram },
        { key: 'facebook', url: BRAND_CONFIG.url_facebook },
        { key: 'tiktok', url: BRAND_CONFIG.url_tiktok },
        { key: 'discord', url: BRAND_CONFIG.url_discord }
    ];

    socialNetworks.forEach(network => {
        document.querySelectorAll(`[data-bind-href="${network.key}"]`).forEach(el => {
            if (!network.url || network.url === '#' || network.url.trim() === '') {
                el.classList.add('hidden');
            } else {
                el.href = network.url;
                el.classList.remove('hidden');
            }
        });
    });

    document.querySelectorAll('[data-bind-href="whatsapp_link"]').forEach(el => el.href = `https://wa.me/${BRAND_CONFIG.whatsapp}`);
    document.querySelectorAll('[data-bind-href="email_link"]').forEach(el => el.href = `mailto:${BRAND_CONFIG.email1}`);

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

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }

    // 4. Load Data & Configs
    await initI18n();
    await loadProjectsData();
    await loadClientsData();
    await loadRatingsData();

    // 5. GSAP Scroll Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
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
            gsap.fromTo(elem, 
                { y: 40, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power2.out"
                }
            );
        });
    }

    // 6. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');

    updateThemeIcons();
    updateFaviconAndLogo();

    function toggleTheme() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
        updateThemeIcons();
        updateFaviconAndLogo();
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);

    // 7. Neural Network AI Background (Canvas)
    initNeuralNetwork();

    // 8. Dynamic AJAX Modal Logic Inicial
    initDynamicModals();

    // 9. Buttons Spark Animations
    initButtonSparks();
});

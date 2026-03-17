/**
 * js/main.js
 * 
 * ============================================
 * GLOBAL CONFIGURATION
 * ============================================
 */
const BRAND_CONFIG = {
    nombre_marca: "NosyeihDev",
    slogan: "Ingeniería",
    subtitulo: "Soluciones de software de élite y automatización. Diseño funcional sin distracciones, enfocado en conversiones.",
    email: "nosyeih.dev@mail.com",
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

    function toggleTheme() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
        updateIcons();
    }

    themeToggleBtn.addEventListener('click', toggleTheme);
    themeToggleMobileBtn.addEventListener('click', toggleTheme);

    // 6. Neural Network AI Background (Canvas)
    initNeuralNetwork();

    // 7. Dynamic AJAX Modal Logic
    initDynamicModals();

    // 8. Load JSON Data (Clients & Ratings)
    loadClientsData();
    loadRatingsData();
});

/**
 * ============================================
 * JSON DATA LOADING LOGIC
 * ============================================
 */

async function loadClientsData() {
    const clientsTrack = document.getElementById('clients-track');
    if (!clientsTrack) return;

    try {
        const response = await fetch('jsons/Clientes.json');
        if (!response.ok) throw new Error('Error loading Clients');
        const data = await response.json();
        const clients = data.clientes || [];

        // Build HTML
        let htmlContent = '';
        clients.forEach(client => {
            // Si el cliente no tiene icono especificado, usamos un servicio de placeholder con las iniciales de su empresa
            const imgSrc = client.Icono || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.Compañia)}&background=random&color=fff&size=200&font-size=0.4&format=svg`;
            
            htmlContent += `
                <a href="${client.url || '#'}" target="_blank" class="px-8 shrink-0 opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300">
                    <img src="${imgSrc}" alt="${client.Compañia}" class="h-10 md:h-12 object-contain">
                </a>
            `;
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
        // Fetch rating entries
        const jsonResponse = await fetch('jsons/Calificacion.json');
        if (!jsonResponse.ok) throw new Error('Error loading Ratings JSON');
        const data = await jsonResponse.json();
        const comentarios = data.comentarios || [];

        // Fetch HTML Template
        const tplResponse = await fetch('Components/Rating.html');
        if (!tplResponse.ok) throw new Error('Error loading Rating Template');
        const templateHtml = await tplResponse.text();

        let gridHtml = '';
        
        comentarios.forEach(item => {
            let itemHtml = templateHtml;
            
            // Reemplazar variables exactas de la plantilla
            itemHtml = itemHtml.replace(/{{mensaje}}/g, item.mensaje || '');
            itemHtml = itemHtml.replace(/{{nombre}}/g, item.nombre || '');
            itemHtml = itemHtml.replace(/{{email}}/g, item.email || '');
            itemHtml = itemHtml.replace(/{{Compañia}}/g, item.Compañia || '');
            
            // Extraer iniciales del nombre
            const initials = (item.nombre || 'U N').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            itemHtml = itemHtml.replace(/{{nombre_iniciales}}/g, initials);

            // Determinar si hay foto
            if (item.foto) {
                const imgHtml = `<img src="${item.foto}" alt="${item.nombre}" class="w-full h-full object-cover">`;
                itemHtml = itemHtml.replace(/<span class="initials">.+?<\/span>/g, imgHtml);
            }

            // Generar estrellas
            let starsHtml = '';
            const maxStars = 5;
            const rating = parseInt(item.rating) || 5;
            for(let i=1; i<=maxStars; i++) {
                if (i <= rating) {
                    starsHtml += `<svg class="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
                } else {
                    starsHtml += `<svg class="w-4 h-4 text-gray-300 dark:text-gray-600 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
                }
            }
            
            // Inyectar estrellas
            // Reemplazar el comentario HTML `<!-- Las estrellas se inyectarán por JS según el rating -->`
            itemHtml = itemHtml.replace(/<!-- Las estrellas se inyectarán por JS según el rating -->/g, starsHtml);

            gridHtml += itemHtml;
        });

        // Duplicamos el contenido para el efecto de marquee infinito suave
        ratingsGrid.innerHTML = gridHtml + gridHtml;

        // Re-initialize Lucide icons inside the dynamically injected ratings grid
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({
                root: ratingsGrid
            });
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
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const url = trigger.getAttribute('data-modal-target');
            if (url) openModal(url);
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
 * TYPEWRITER EFFECT
 * ============================================
 */
function initTypewriter() {
    const sloganEl = document.getElementById('tw-slogan');
    const mainTextEl = document.getElementById('typewriter-text');
    const subEl = document.getElementById('tw-sub');
    
    if (!sloganEl || !mainTextEl || !subEl) return;
    
    // Clear elements
    sloganEl.textContent = "";
    mainTextEl.textContent = "";
    subEl.textContent = "";

    // Text to type
    const sloganText = BRAND_CONFIG.slogan;
    const mainText = "tecnológica.";
    const subText = BRAND_CONFIG.subtitulo;

    // Create a dynamic cursor element
    const cursor = document.createElement('span');
    cursor.className = "inline-block w-[0.4em] lg:w-[0.5em] h-[1em] animate-rgb-cursor ml-1 align-middle opacity-80";
    
    // Helper to type text into an element
    function typeText(element, text, minSpeed, maxSpeed) {
        return new Promise(resolve => {
            let i = 0;
            element.appendChild(cursor); // Move cursor to active element
            
            function type() {
                if (i < text.length) {
                    // Inject character before the cursor
                    const charNode = document.createTextNode(text.charAt(i));
                    element.insertBefore(charNode, cursor);
                    i++;
                    setTimeout(type, Math.random() * (maxSpeed - minSpeed) + minSpeed);
                } else {
                    resolve();
                }
            }
            type();
        });
    }

    // Run sequentially with slower speeds as requested
    async function runTypewriterSequence() {
        // 1. Slogan (moderate-slow speed)
        await typeText(sloganEl, sloganText, 80, 180);
        await new Promise(r => setTimeout(r, 400)); // Pause

        // 2. Main Word "tecnológica." (slow, dramatic)
        // Smaller/customized cursor size for the huge heading if needed, but we rely on ems so it's relative
        await typeText(mainTextEl, mainText, 150, 300); 
        await new Promise(r => setTimeout(r, 500)); // Pause

        // 3. Subtitle (faster speed, since it's a long paragraph)
        await typeText(subEl, subText, 10, 30);
        
        // Final state: leave cursor blinking at the end of subtitle
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

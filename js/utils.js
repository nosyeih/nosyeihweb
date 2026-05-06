/**
 * js/utils.js
 * Funcionalidad transversal, helpers y animaciones puras.
 */

import { BRAND_CONFIG } from './config.js';

/**
 * Actualiza los íconos Lucide. Reusable para evitar acoplamiento fuerte a window.
 */
export function initIcons(root = document) {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ root });
    }
}

/**
 * Inicializa la animación de Typewriter de la Hero Section.
 */
export function initTypewriter() {
    const mainTextEl = document.getElementById('typewriter-text');
    const subEl = document.getElementById('tw-sub');
    
    if (!mainTextEl || !subEl) return;
    
    // Evita bucles sobrelapados
    window.twActive = (window.twActive || 0) + 1;
    const currentLoopId = window.twActive;

    mainTextEl.textContent = "";
    subEl.textContent = "";

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
            
            await Promise.all([
                typeText(mainTextEl, phrase.title, cursorMain, 8, 20),
                typeText(subEl, phrase.subtitle, cursorSub, 2, 8)
            ]);

            await new Promise(r => setTimeout(r, 6000));
            if (window.twActive !== currentLoopId) break;

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
 * Animación interactiva en Canvas imitando red neuronal.
 */
export function initNeuralNetwork() {
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

    const getThemeColors = () => {
        const isDark = document.documentElement.classList.contains('dark');
        return {
            node: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.8)',
            line: isDark ? '255, 255, 255' : '0, 0, 0',
            lineOpacityMult: isDark ? 0.15 : 0.4,
            mouseLine: isDark ? '150, 200, 255' : '15, 23, 42',
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
        }

        draw(colors) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = colors.node;
            ctx.fill();
        }

        update(colors) {
            if (this.x > width || this.x < 0) this.dx = -this.dx;
            if (this.y > height || this.y < 0) this.dy = -this.dy;

            this.x += this.dx;
            this.y += this.dy;

            if (mouse.x && mouse.y) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    this.x += forceDirectionX * 1;
                    this.y += forceDirectionY * 1;
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

/**
 * Actualiza iconos visuales de sol/luna acorde al estado actual.
 */
export function updateThemeIcons() {
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const darkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');
    const lightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');

    if (document.documentElement.classList.contains('dark')) {
        darkIcon?.classList.add('hidden');
        lightIcon?.classList.remove('hidden');
        darkIconMobile?.classList.add('hidden');
        lightIconMobile?.classList.remove('hidden');
    } else {
        lightIcon?.classList.add('hidden');
        darkIcon?.classList.remove('hidden');
        lightIconMobile?.classList.add('hidden');
        darkIconMobile?.classList.remove('hidden');
    }
}

/**
 * Actualiza dinámicamente el favicon basado en modo dark o light.
 */
export function updateFaviconAndLogo() {
    const isDark = document.documentElement.classList.contains('dark');
    const folder = isDark ? 'white' : 'black';
    const logoImg = document.getElementById('brand-logo');
    
    if (logoImg) {
        logoImg.src = `img/logo/${folder}/favicon-96x96.png`;
    }

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
 * Inicia la animación de chispas y rayos en los botones con canvas (ej. index buttons).
 */
export function initButtonSparks() {
    const canvases = document.querySelectorAll('.spark-btn-canvas');
    if (canvases.length === 0) return;

    canvases.forEach(canvas => {
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
            const margin = 0; // Margin is 0 because the canvas fits exactly inside the container now
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
                
                if (Math.random() > 0.8) { 
                    for(let s=0; s<5; s++) sparks.push(new Spark(tx, ty));
                }
            }
            return { segments, life: 1.0, decay: 0.1 + Math.random() * 0.2 };
        }

        function animate() {
            // Comprobar si el canvas sigue visible en el DOM (en caso se remueva o se oculte)
            if (!document.body.contains(canvas)) return;
            
            ctx.clearRect(0, 0, width, height);
            
            // Generate sparks less frequently maybe, but let's stick to the project modal frequency
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

        // Delay starting slightly so bounding client rect is accurate after layouts
        setTimeout(() => {
            resize();
            animate();
        }, 100);
    });
}

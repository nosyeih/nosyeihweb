/**
 * js/gallery.js
 * Lógica funcional para controlar la galería tipo Coverflow 3D.
 */

/**
 * Extrae el ID de un video de YouTube y devuelve la URL de embed.
 * @param {string} url 
 * @returns {string|null}
 */
function getYouTubeEmbedUrl(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?enablejsapi=1` : null;
}

/**
 * Abre el modal de galería e inyecta las imágenes y videos correspondientes con efecto Coverflow 3D.
 * @param {Object} project - Objeto de datos del proyecto que contiene las imágenes y videos.
 */
export function openGalleryModal(project) {
    const galleryModal = document.getElementById('gallery-modal');
    if (!galleryModal) return;

    const galleryBody = document.getElementById('gallery-body');
    const galleryTitle = document.getElementById('gallery-title');
    const galleryCounter = document.getElementById('gallery-counter');

    // Consolidar items (videos primero, luego imágenes)
    const items = [];
    
    // Buscar campos de video dinámicamente (video1, video2, etc) o un array 'videos'
    if (project.videos && Array.isArray(project.videos)) {
        project.videos.forEach(v => items.push({ type: 'video', src: v }));
    } else {
        Object.keys(project).forEach(key => {
            if (key.startsWith('video') && project[key]) {
                items.push({ type: 'video', src: project[key] });
            }
        });
    }

    if (project.imagenes && project.imagenes.length > 0) {
        project.imagenes.forEach(img => items.push({ type: 'image', src: img }));
    }

    if (items.length > 0) {
        const visibleItems = items;
        
        // DETECCIÓN DE TEMA (MODO CLARO/OSCURO)
        const isDark = document.documentElement.classList.contains('dark');
        const overlay = document.getElementById('gallery-overlay');
        const bgOverlay = isDark ? 'rgba(0,0,0,0.98)' : 'rgba(255,255,255,0.98)';
        const textColor = isDark ? 'white' : '#1a1a1a';
        const mutedColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';

        if (overlay) {
            overlay.style.backgroundColor = bgOverlay;
            overlay.style.backdropFilter = 'blur(20px)';
        }

        // Estilos base para el contenedor
        galleryBody.style.display = 'flex';
        galleryBody.style.alignItems = 'center';
        galleryBody.style.gap = '8vw';
        galleryBody.style.padding = '0 10vw';
        galleryBody.style.width = '100vw';
        galleryBody.style.height = '100%';
        galleryBody.style.scrollSnapType = 'x mandatory';
        galleryBody.style.overflowX = 'auto';
        galleryBody.style.overflowY = 'hidden';
        galleryBody.style.scrollBehavior = 'smooth';
        galleryBody.className = "hide-scrollbar cursor-grab active:cursor-grabbing";

        galleryBody.innerHTML = visibleItems.map((item, i) => {
            const isVideo = item.type === 'video';
            const shadow = isDark ? '0 20px 50px rgba(0,0,0,0.7)' : '0 20px 50px rgba(0,0,0,0.15)';
            const content = isVideo 
                ? `<iframe src="${getYouTubeEmbedUrl(item.src)}" style="width:100%; height:100%; border-radius:1.5rem; background:black;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                : `<img src="${item.src}" loading="lazy" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:1.5rem; box-shadow: ${shadow}; border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};" />`;

            return `
                <div class="gallery-item" data-index="${i}" style="
                    scroll-snap-align: center;
                    flex-shrink: 0;
                    width: 80vw;
                    max-width: 1100px;
                    height: 70vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: none;
                    z-index: 5;
                ">
                    <div class="gallery-item-content" style="
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        pointer-events: auto;
                        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    ">
                        ${content}
                    </div>
                </div>
            `;
        }).join('');
        
        galleryTitle.innerHTML = project.titulo_modal || 'Galería';
        galleryTitle.style.color = textColor;
        galleryCounter.textContent = `1 / ${visibleItems.length}`;
        galleryCounter.style.color = mutedColor;
        
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');
        const closeBtn = document.getElementById('gallery-close');
        
        [prevBtn, nextBtn, closeBtn].forEach(btn => {
            if (btn) btn.style.color = textColor;
        });

        const updateArrows = (index) => {
             if(prevBtn) {
                 prevBtn.style.opacity = index === 0 ? '0.1' : '1';
                 prevBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';
             }
             if(nextBtn) {
                 nextBtn.style.opacity = index === visibleItems.length - 1 ? '0.1' : '1';
                 nextBtn.style.pointerEvents = index === visibleItems.length - 1 ? 'none' : 'auto';
             }
        };

        const updateGalleryStyles = (activeIndex) => {
            const items = galleryBody.querySelectorAll('.gallery-item');
            items.forEach((child, i) => {
                const content = child.querySelector('.gallery-item-content');
                if (!content) return;

                if (i === activeIndex) {
                    child.style.transform = 'scale(1)';
                    child.style.opacity = '1';
                    child.style.zIndex = '10';
                    content.style.filter = 'brightness(1) blur(0px)';
                } else {
                    const dist = Math.abs(i - activeIndex);
                    child.style.transform = 'scale(0.85)';
                    child.style.opacity = dist > 1 ? '0.05' : '0.4';
                    child.style.zIndex = '5';
                    content.style.filter = isDark ? 'brightness(0.3) blur(5px)' : 'brightness(0.8) grayscale(0.5) blur(5px)';
                }
            });
        };


        const observerOptions = {
            root: galleryBody,
            threshold: 0.6
        };

        let currentIndex = 0;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.getAttribute('data-index'));
                    galleryCounter.textContent = `${index + 1} / ${visibleItems.length}`;
                    updateArrows(index);
                    updateGalleryStyles(index);
                    currentIndex = index;
                }
            });
        }, observerOptions);

        galleryBody.querySelectorAll('.gallery-item').forEach(item => observer.observe(item));

        const scrollToItem = (index) => {
            const items = galleryBody.querySelectorAll('.gallery-item');
            if(items[index]) {
                items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        };

        if(prevBtn) {
            prevBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if(currentIndex > 0) scrollToItem(currentIndex - 1);
            };
        }
        if(nextBtn) {
            nextBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if(currentIndex < visibleItems.length - 1) scrollToItem(currentIndex + 1);
            };
        }



        project._cleanupGallery = () => {
             observer.disconnect();
        };

        // Initial state
        setTimeout(() => {
            updateArrows(0);
            updateGalleryStyles(0);
        }, 100);
    }

    galleryModal.classList.remove('hidden');
    void galleryModal.offsetWidth;
    galleryModal.classList.remove('opacity-0', 'pointer-events-none');
    
    const closeGalleryModal = () => {
        galleryModal.classList.add('opacity-0', 'pointer-events-none');
        if(project._cleanupGallery) project._cleanupGallery();
        
        setTimeout(() => {
            galleryModal.classList.add('hidden');
            galleryBody.innerHTML = '';
        }, 500);
        document.removeEventListener('keydown', window._galleryEscListener);
    };

    const galleryCloseBtn = document.getElementById('gallery-close');
    const galleryOverlay = document.getElementById('gallery-overlay');
    if (galleryCloseBtn) galleryCloseBtn.onclick = closeGalleryModal;
    if (galleryOverlay) galleryOverlay.onclick = closeGalleryModal;

    window._galleryEscListener = function(e) {
        if (e.key === 'Escape' && !galleryModal.classList.contains('hidden')) {
            closeGalleryModal();
        }
        if (!galleryModal.classList.contains('hidden')) {
            if (e.key === 'ArrowRight') document.getElementById('gallery-next')?.click();
            if (e.key === 'ArrowLeft') document.getElementById('gallery-prev')?.click();
        }
    };
    document.addEventListener('keydown', window._galleryEscListener);
}


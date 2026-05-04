/**
 * js/gallery.js
 * Lógica funcional para controlar la galería tipo Coverflow 3D.
 */

/**
 * Abre el modal de galería e inyecta las imágenes correspondientes con efecto Coverflow 3D.
 * @param {Object} project - Objeto de datos del proyecto que contiene las imágenes.
 */
export function openGalleryModal(project) {
    const galleryModal = document.getElementById('gallery-modal');
    if (!galleryModal) return;

    const galleryBody = document.getElementById('gallery-body');
    const galleryTitle = document.getElementById('gallery-title');
    const galleryCounter = document.getElementById('gallery-counter');

    if (project.imagenes && project.imagenes.length > 0) {
        const visibleImages = project.imagenes.slice(0, 10);
        
        galleryBody.innerHTML = visibleImages.map((imgSrc, i) => `
            <div class="snap-center shrink-0 w-[80%] md:w-[60%] lg:w-[50%] h-[50vh] md:h-[65vh] relative flex items-center justify-center pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
                <img src="${imgSrc}" loading="lazy" class="max-w-full max-h-full object-contain pointer-events-auto border border-white/10 rounded-xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
            </div>
        `).join('');
        
        galleryTitle.innerHTML = project.titulo_modal || 'Galería';
        galleryCounter.textContent = `1 / ${visibleImages.length}`;
        
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');
        
        const updateArrows = (index) => {
             if(prevBtn) prevBtn.style.opacity = index === 0 ? '0.3' : '1';
             if(prevBtn) prevBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';
             if(nextBtn) nextBtn.style.opacity = index === visibleImages.length - 1 ? '0.3' : '1';
             if(nextBtn) nextBtn.style.pointerEvents = index === visibleImages.length - 1 ? 'none' : 'auto';
        };

        const scrollToItem = (index) => {
            const children = galleryBody.children;
            if(children[index]) {
                children[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        };

        const getVisibleIndex = () => {
            let minDiff = Infinity;
            let idx = 0;
            const containerCenter = window.innerWidth / 2;
            Array.from(galleryBody.children).forEach((child, i) => {
                const rect = child.getBoundingClientRect();
                const childCenter = rect.left + rect.width / 2;
                const diff = Math.abs(childCenter - containerCenter);
                if (diff < minDiff) {
                    minDiff = diff;
                    idx = i;
                }
            });
            return idx;
        };

        let currentIndex = 0;

        if(prevBtn) {
            prevBtn.onclick = () => {
                currentIndex = getVisibleIndex();
                if(currentIndex > 0) scrollToItem(currentIndex - 1);
            };
        }
        if(nextBtn) {
            nextBtn.onclick = () => {
                currentIndex = getVisibleIndex();
                if(currentIndex < visibleImages.length - 1) scrollToItem(currentIndex + 1);
            };
        }

        const updateGalleryStyles = (activeIndex) => {
            Array.from(galleryBody.children).forEach((child, i) => {
                const img = child.querySelector('img');
                if (!img) return;
                
                if (i === activeIndex) {
                    child.style.transform = 'scale(1) translateZ(0)';
                    child.style.opacity = '1';
                    child.style.zIndex = '10';
                    img.style.filter = 'brightness(1)';
                } else if (i < activeIndex) {
                    child.style.transform = 'scale(0.85) perspective(1200px) rotateY(25deg)';
                    child.style.opacity = '0.35';
                    child.style.zIndex = '5';
                    img.style.filter = 'brightness(0.4)';
                } else {
                    child.style.transform = 'scale(0.85) perspective(1200px) rotateY(-25deg)';
                    child.style.opacity = '0.35';
                    child.style.zIndex = '5';
                    img.style.filter = 'brightness(0.4)';
                }
            });
        };

        const scrollHandler = () => {
            currentIndex = getVisibleIndex();
            galleryCounter.textContent = `${Math.min(currentIndex + 1, visibleImages.length)} / ${visibleImages.length}`;
            updateArrows(currentIndex);
            updateGalleryStyles(currentIndex);
        };
        
        galleryBody.addEventListener('scroll', scrollHandler);
        
        let scrollTimeout;
        galleryBody.addEventListener('wheel', (e) => {
             clearTimeout(scrollTimeout);
        }, { passive: true });

        updateArrows(0);
        setTimeout(() => updateGalleryStyles(0), 50);
        
        project._cleanupGallery = () => {
             galleryBody.removeEventListener('scroll', scrollHandler);
        };
    }

    galleryModal.classList.remove('hidden');
    void galleryModal.offsetWidth;
    galleryModal.classList.remove('opacity-0', 'pointer-events-none');
    
    const closeGallery = () => {
        galleryModal.classList.add('opacity-0', 'pointer-events-none');
        document.removeEventListener('keydown', window._galleryEscListener);
        if(project._cleanupGallery) project._cleanupGallery();
        
        setTimeout(() => {
            galleryModal.classList.add('hidden');
            galleryBody.innerHTML = '';
        }, 500);
    };

    const galleryCloseBtn = document.getElementById('gallery-close');
    const galleryOverlay = document.getElementById('gallery-overlay');
    if (galleryCloseBtn) galleryCloseBtn.onclick = closeGallery;
    if (galleryOverlay) galleryOverlay.onclick = closeGallery;

    window._galleryEscListener = function(e) {
        if (e.key === 'Escape') {
            closeGallery();
        }
    };
    document.addEventListener('keydown', window._galleryEscListener);
}

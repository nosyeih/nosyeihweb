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
const SERVICES_DATA = {
    es: [
        {
            id: "s1",
            icon: "terminal",
            category: "Desarrollo de Software",
            title: "Desarrollo de Software a Medida",
            human_title: "¿Quieres una página web profesional o una plataforma única para tu negocio?",
            desc: "Creamos páginas web de última generación y aplicaciones a la medida de tus necesidades, garantizando velocidad extrema, seguridad y un diseño exclusivo que enamora a tus clientes.",
            examples_title: "Ejemplos prácticos de lo que hacemos:",
            examples: [
                {
                    title: "Páginas de Lanzamiento (Landing Pages):",
                    desc: "Páginas web rápidas y vendedoras, diseñadas con secciones estratégicas para captar clientes, presentar un producto estrella y cerrar ventas sin distracciones."
                },
                {
                    title: "Sitios Web Corporativos:",
                    desc: "La cara digital de tu empresa en internet. Diseños rápidos, modernos, adaptados a celulares y listos para posicionarse en los primeros puestos de Google."
                },
                {
                    title: "Aplicaciones y Sistemas Web:",
                    desc: "Sistemas interactivos y personalizados para gestionar reservas, vender en línea, catálogos interactivos, plataformas educativas o cualquier idea digital."
                }
            ],
            cta_heading: "¿Listo para dar el siguiente paso?",
            cta_desc: "Escríbenos hoy y coticemos tu página o aplicación a la medida sin compromiso.",
            cta_button: "Solicitar este Servicio"
        },
        {
            id: "s2",
            icon: "bot",
            category: "Agentes de IA",
            title: "Agentes de IA y Chatbots",
            human_title: "¿Quieres automatizar tu atención al cliente y vender las 24 horas?",
            desc: "Diseñamos asistentes virtuales inteligentes con Inteligencia Artificial de vanguardia que chatean como humanos, resuelven dudas, agendan citas y captan prospectos de forma autónoma.",
            examples_title: "Ejemplos prácticos de lo que hacemos:",
            examples: [
                {
                    title: "Agentes de WhatsApp Inteligentes:",
                    desc: "Conectamos la IA de ChatGPT directamente a tu número para que atienda clientes, responda preguntas de tu catálogo, agende citas o envíe cotizaciones de inmediato."
                },
                {
                    title: "Asistentes Integrados en tu Web:",
                    desc: "Chatbots elegantes que reciben a los visitantes de tu sitio, resuelven sus preguntas frecuentes de inmediato y capturan sus datos de contacto para tu equipo de ventas."
                },
                {
                    title: "Entrenamiento con Información de tu Empresa:",
                    desc: "Le enseñamos a la IA todo sobre tu negocio (manuales, políticas, precios) para que sus respuestas sean 100% precisas, profesionales y sin errores."
                }
            ],
            cta_heading: "¿Listo para automatizar tus chats?",
            cta_desc: "Escríbenos y diseñemos un agente inteligente a la medida de tu flujo de trabajo.",
            cta_button: "Solicitar este Servicio"
        },
        {
            id: "s3",
            icon: "workflow",
            category: "Automatización",
            title: "Automatizaciones (n8n)",
            human_title: "¿Cansado de hacer tareas manuales, repetitivas y aburridas en la computadora?",
            desc: "Conectamos tus aplicaciones diarias (WhatsApp, Excel, Gmail, CRM, etc.) para que compartan datos entre sí y ejecuten tareas automáticamente sin que tengas que mover un dedo.",
            examples_title: "Ejemplos prácticos de lo que hacemos:",
            examples: [
                {
                    title: "Registro de Prospectos en Tiempo Real:",
                    desc: "Cuando alguien te escriba o llene un formulario, su información se guardará al instante en tu base de datos o Excel y se enviará un correo automático."
                },
                {
                    title: "Alertas y Notificaciones Instantáneas:",
                    desc: "Recibe notificaciones inmediatas en tu celular cuando ocurra algo importante en tu negocio (ventas, pedidos, registros) para actuar rápido."
                },
                {
                    title: "Procesamiento de Documentos Inteligente:",
                    desc: "Flujos automáticos que extraen información de facturas o correos entrantes, rellenan reportes financieros y los archivan de forma segura en la nube."
                }
            ],
            cta_heading: "¿Listo para liberar tu tiempo?",
            cta_desc: "Cuéntanos qué procesos manuales haces hoy en tu negocio y nosotros los automatizaremos.",
            cta_button: "Solicitar este Servicio"
        },
        {
            id: "s4",
            icon: "briefcase",
            category: "Sistemas & Dashboards",
            title: "Sistemas B2B & Dashboards",
            human_title: "¿Quieres tener el control operativo y financiero de tu negocio en un solo panel?",
            desc: "Creamos portales web privados y paneles administrativos sencillos pero potentes para centralizar tu información de ventas, clientes, inventarios y finanzas de forma segura.",
            examples_title: "Ejemplos prácticos de lo que hacemos:",
            examples: [
                {
                    title: "Paneles de Control de Ventas e Ingresos (Dashboards):",
                    desc: "Gráficos intuitivos y tablas actualizadas en tiempo real para visualizar ingresos, gastos, rendimiento de vendedores y estadísticas clave para decidir mejor."
                },
                {
                    title: "Portales de Autogestión para Clientes o Socios:",
                    desc: "Áreas privadas donde tus clientes corporativos o usuarios pueden iniciar sesión, descargar facturas, ver el estado de sus pedidos o contratar servicios por sí mismos."
                },
                {
                    title: "Sistemas de Administración Interna:",
                    desc: "Herramientas de software ágiles para llevar el control de stock, registrar compras, coordinar entregas y delegar tareas operativas a tu personal."
                }
            ],
            cta_heading: "¿Listo para poner orden en tu empresa?",
            cta_desc: "Escríbenos y diseñemos un sistema interno visual, intuitivo y adaptado a tus flujos de trabajo.",
            cta_button: "Solicitar este Servicio"
        }
    ],
    en: [
        {
            id: "s1",
            icon: "terminal",
            category: "Software Development",
            title: "Custom Software Development",
            human_title: "Do you want a unique digital platform or a professional website for your business?",
            desc: "We build next-generation websites and tailor-made applications designed specifically for your needs, guaranteeing extreme speed, robust security, and exclusive design to attract customers.",
            examples_title: "Practical examples of what we do:",
            examples: [
                {
                    title: "Landing Pages:",
                    desc: "High-conversion web pages designed with strategic sections to attract leads, showcase a star product, and drive sales without distractions."
                },
                {
                    title: "Corporate Websites:",
                    desc: "A highly professional internet presence for your company. Fast, modern, responsive for mobile phones, and optimized for Google search rankings."
                },
                {
                    title: "Web Applications & Interactive Portals:",
                    desc: "Custom interactive systems to manage bookings, online catalogs, e-commerce, educational platforms, or any custom digital product."
                }
            ],
            cta_heading: "Ready to take the next step?",
            cta_desc: "Get in touch with us today and let's discuss your custom project without any obligation.",
            cta_button: "Inquire About This Service"
        },
        {
            id: "s2",
            icon: "bot",
            category: "AI Agents",
            title: "AI Agents & Chatbots",
            human_title: "Do you want to automate customer support and make sales 24/7?",
            desc: "We design intelligent virtual assistants powered by state-of-the-art AI that chat like humans, answer questions, schedule appointments, and capture leads autonomously.",
            examples_title: "Practical examples of what we do:",
            examples: [
                {
                    title: "Intelligent WhatsApp Agents:",
                    desc: "We connect ChatGPT technology directly to your WhatsApp number to handle customers, answer questions about your catalog, schedule bookings, or send quotes instantly."
                },
                {
                    title: "Website-Integrated Assistants:",
                    desc: "Elegant chat widgets that greet visitors, solve their frequently asked questions instantly, and capture their contact info for your sales team."
                },
                {
                    title: "Custom Business Training:",
                    desc: "We feed the AI with your business knowledge base (manuals, catalogs, pricing) to ensure 100% accurate, helpful, and professional answers without errors."
                }
            ],
            cta_heading: "Ready to automate your chats?",
            cta_desc: "Contact us today and let's design an intelligent agent tailored specifically to your workflow.",
            cta_button: "Inquire About This Service"
        },
        {
            id: "s3",
            icon: "workflow",
            category: "Automation",
            title: "Business Automations (n8n)",
            human_title: "Tired of doing repetitive, manual, and boring computer work?",
            desc: "We connect your daily digital tools (WhatsApp, Excel, Gmail, CRMs, etc.) so they instantly share data and perform tasks automatically without you having to lift a finger.",
            examples_title: "Practical examples of what we do:",
            examples: [
                {
                    title: "Real-Time Lead Syncing:",
                    desc: "When someone writes to you or fills a form, their contact details are instantly saved in your CRM or spreadsheet, triggering an automated welcome email."
                },
                {
                    title: "Instant Alerts & Reminders:",
                    desc: "Receive immediate notifications on your phone or Slack when sales, orders, or registration milestones occur so you can act quickly."
                },
                {
                    title: "Smart Document Processing:",
                    desc: "Automated flows that extract data from incoming invoices or emails, automatically populate spreadsheets, and back up files securely in the cloud."
                }
            ],
            cta_heading: "Ready to free up your time?",
            cta_desc: "Tell us about your manual processes, and we will build intelligent automations to handle them for you.",
            cta_button: "Inquire About This Service"
        },
        {
            id: "s4",
            icon: "briefcase",
            category: "Systems & Dashboards",
            title: "B2B Systems & Dashboards",
            human_title: "Do you want to control your entire business operations from a single visual dashboard?",
            desc: "We build secure corporate web portals and custom administrative dashboards to centralize your sales data, inventory, customer relationships, and finances effortlessly.",
            examples_title: "Practical examples of what we do:",
            examples: [
                {
                    title: "Sales & Financial Dashboards:",
                    desc: "Intuitive charts and live data boards to visualize revenues, expenses, sales performance, and key indicators for fast decision-making."
                },
                {
                    title: "Customer & Partner Portals:",
                    desc: "Secure private areas where clients can log in, download invoices, track order statuses, or request support completely on their own."
                },
                {
                    title: "Internal Management Systems:",
                    desc: "Fast, custom web software to manage stock counts, log purchases, dispatch logistics, and assign daily tasks to your employees."
                }
            ],
            cta_heading: "Ready to streamline your company?",
            cta_desc: "Inquire today to build a visual, clean, and secure internal system tailored precisely to your operational flows.",
            cta_button: "Inquire About This Service"
        }
    ]
};

/**
 * Abre el modal de servicios y lo renderiza de forma dinámica e interactiva.
 * @param {string} serviceId - ID del servicio ('s1', 's2', 's3', 's4')
 */
export async function openServiceModal(serviceId) {
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
        const response = await fetch('Components/ModalService.html');
        if (!response.ok) throw new Error('Could not load service modal template');
        const templateHtml = await response.text();

        renderServiceInModal(serviceId, templateHtml);
    } catch (error) {
        console.error('Error loading service modal template:', error);
        modalBody.innerHTML = `<div class="p-8 text-center text-red-500 font-mono">Error al cargar plantilla de servicios.</div>`;
    }
}

/**
 * Renderiza el contenido del servicio seleccionado dentro del modal.
 */
function renderServiceInModal(serviceId, templateHtml) {
    const modalBody = document.getElementById('modal-body');
    if (!modalBody) return;

    const lang = STATE.currentLang || 'es';
    const services = SERVICES_DATA[lang] || SERVICES_DATA['es'];
    const serviceIndex = services.findIndex(s => s.id === serviceId);
    if (serviceIndex === -1) return;

    const service = services[serviceIndex];

    // Build examples list HTML
    const examplesHtml = service.examples.map((ex, idx) => `
        <div class="flex gap-4 p-4 bg-light-800 dark:bg-dark-900 border border-light-border dark:border-dark-border rounded-sm transition-all duration-300 hover:border-light-accent dark:hover:border-white">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-light-accent/10 dark:bg-white/10 flex items-center justify-center font-mono text-xs font-bold text-light-accent dark:text-white">
                0${idx + 1}
            </div>
            <div>
                <h4 class="text-xs font-mono font-bold tracking-tight text-light-accent dark:text-white mb-1">${ex.title}</h4>
                <p class="text-xs text-light-muted dark:text-dark-muted font-light leading-relaxed">${ex.desc}</p>
            </div>
        </div>
    `).join('');

    let html = templateHtml;
    html = html.replace(/{{category}}/g, service.category);
    html = html.replace(/{{human_title}}/g, service.human_title);
    html = html.replace(/{{desc}}/g, service.desc);
    html = html.replace(/{{examples_title}}/g, service.examples_title);
    html = html.replace(/{{examples_html}}/g, examplesHtml);
    html = html.replace(/{{cta_heading}}/g, service.cta_heading);
    html = html.replace(/{{cta_desc}}/g, service.cta_desc);
    html = html.replace(/{{cta_button}}/g, service.cta_button);

    modalBody.innerHTML = html;
    initIcons(modalBody);

    // Update active state on top tabs
    modalBody.querySelectorAll('[data-service-tab]').forEach(tab => {
        const tabId = tab.getAttribute('data-service-tab');
        if (tabId === serviceId) {
            tab.className = "text-[10px] font-mono tracking-widest uppercase px-4 py-2 border bg-light-accent text-white dark:bg-white dark:text-black border-light-accent dark:border-white rounded-full transition-all duration-300 pointer-events-none";
        } else {
            tab.className = "text-[10px] font-mono tracking-widest uppercase px-4 py-2 border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-light-accent dark:hover:text-white rounded-full transition-all duration-300 cursor-pointer";
            tab.addEventListener('click', () => {
                renderServiceInModal(tabId, templateHtml);
            });
        }
    });

    // Request service button handler
    const reqBtn = document.getElementById('request-service-btn');
    if (reqBtn) {
        reqBtn.addEventListener('click', () => {
            // Close modal
            document.getElementById('modal-close').click();
            
            // Wait for modal animation, then scroll to contact and focus / fill
            setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                    const msgInput = document.querySelector('textarea[name="message"]') || document.getElementById('message');
                    if (msgInput) {
                        const prefillMsg = lang === 'en' 
                            ? `Hello! I would like to inquire about the service: ${service.title}.`
                            : `¡Hola! Me gustaría cotizar y solicitar más información sobre el servicio de: ${service.title}.`;
                        msgInput.value = prefillMsg;
                        msgInput.focus();
                    }
                }
            }, 350);
        });
    }

    // Prev / Next buttons
    const prevBtn = document.getElementById('prev-service-btn');
    const nextBtn = document.getElementById('next-service-btn');

    if (prevBtn) {
        const prevIndex = (serviceIndex - 1 + services.length) % services.length;
        const prevServiceId = services[prevIndex].id;
        const prevTextSpan = prevBtn.querySelector('span');
        if (prevTextSpan) prevTextSpan.textContent = lang === 'en' ? 'Previous' : 'Anterior';
        prevBtn.addEventListener('click', () => {
            renderServiceInModal(prevServiceId, templateHtml);
        });
    }

    if (nextBtn) {
        const nextIndex = (serviceIndex + 1) % services.length;
        const nextServiceId = services[nextIndex].id;
        const nextTextSpan = nextBtn.querySelector('span');
        if (nextTextSpan) nextTextSpan.textContent = lang === 'en' ? 'Next' : 'Siguiente';
        nextBtn.addEventListener('click', () => {
            renderServiceInModal(nextServiceId, templateHtml);
        });
    }
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

    // Dynamic Services Modals
    root.querySelectorAll('[data-service-id]').forEach(trigger => {
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);

        newTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceId = newTrigger.getAttribute('data-service-id');
            if (serviceId) openServiceModal(serviceId);
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

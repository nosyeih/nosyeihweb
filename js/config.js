/**
 * js/config.js
 * Configuración Global y Estado de la Aplicación.
 */

export const BRAND_CONFIG = {
    nombre_marca: "HieysoN",
    hero_phrases: [
        { title: "Tecnología de última generación para negocios modernos.", subtitle: "Creamos sistemas digitales con Inteligencia Artificial para automatizar tus tareas diarias. Ahorra tiempo, dinero y haz que tu negocio trabaje en piloto automático." },
        { title: "Ecosistemas digitales diseñados para escalar.", subtitle: "Transformamos la forma en que operas usando software a la medida. Olvídate del trabajo manual rutinario y enfócate en hacer crecer tu empresa." },
        { title: "Automatización inteligente que acelera tus metas.", subtitle: "Conectamos herramientas como WhatsApp a tus bases de datos para crear asistentes en línea que atienden a tus clientes las 24 horas del día sin errores." }
    ],
    slogan: "Software Inteligente",
    subtitulo: "Diseñamos plataformas digitales y sistemas automatizados que tus usuarios amarán. Integramos IA y flujos con n8n.",
    email1: "contacto@hieyson.com",
    email2: "developer@hieyson.com",
    url_linkedin: "https://www.linkedin.com/in/nosyeih-dev/",
    url_github: "https://github.com/NosyeihDev",
    whatsapp: "51935533845",
};

/**
 * Objeto de estado mutable para datos compartidos a través de distintos archivos.
 */
export const STATE = {
    currentLang: localStorage.getItem('site-lang') || 'es',
    PROJECTS_DATA: []
};

/**
 * Mutador de lenguaje que guarda en local storage automáticamente.
 * @param {string} lang 'es' o 'en'
 */
export function setLanguage(lang) {
    STATE.currentLang = lang;
    localStorage.setItem('site-lang', lang);
}

/**
 * Actualiza el arreglo global de proyectos.
 * @param {Array} projects 
 */
export function setProjectsData(projects) {
    STATE.PROJECTS_DATA = projects;
}

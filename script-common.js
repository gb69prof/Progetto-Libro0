// script-common.js
// ----------------
// Funzioni condivise per tutto il Libro.0
// - Gestione temi A–E (salvati in localStorage)
// - Gestione immagini ingrandibili (classe .zoomable-image)

// Chiave per il tema salvato
const THEME_STORAGE_KEY = "libro0-theme";

// Applica il tema aggiungendo una classe al <body>
// Esempio: theme-A, theme-B, ...
function applyTheme(themeCode) {
    const body = document.body;
    if (!body) return;

    // Rimuovi eventuali classi tema precedenti
    body.classList.remove(
        "theme-A",
        "theme-B",
        "theme-C",
        "theme-D",
        "theme-E"
    );

    // Aggiungi la nuova (solo se valida)
    const allowedThemes = ["A", "B", "C", "D", "E"];
    if (allowedThemes.includes(themeCode)) {
        body.classList.add(`theme-${themeCode}`);
    }
}

// Inizializza il selettore dei temi (se presente)
function initThemeSelector() {
    // Recupera il tema salvato o imposta A di default
    let savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (!savedTheme) {
        savedTheme = "A";
        localStorage.setItem(THEME_STORAGE_KEY, savedTheme);
    }

    // Applica subito il tema
    applyTheme(savedTheme);

    // Bottoni o elementi che permettono di cambiare tema
    // Esempio in HTML: <button class="theme-choice" data-theme="A">A</button>
    const themeButtons = document.querySelectorAll(".theme-choice[data-theme]");

    themeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const newTheme = button.getAttribute("data-theme");
            if (!newTheme) return;

            // Salva e applica
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
            applyTheme(newTheme);
        });
    });

    // Eventuale <select> per i temi (opzionale)
    // Esempio: <select id="theme-select"><option value="A">A</option>...</select>
    const themeSelect = document.getElementById("theme-select");
    if (themeSelect) {
        // Imposta il valore attuale
        themeSelect.value = savedTheme;

        themeSelect.addEventListener("change", () => {
            const newTheme = themeSelect.value;
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
            applyTheme(newTheme);
        });
    }
}

// Inizializza lo zoom per tutte le immagini con classe .zoomable-image
function initImageZoom() {
    const zoomableImages = document.querySelectorAll(".zoomable-image");
    const overlay = document.getElementById("image-overlay");
    const overlayImage = document.getElementById("overlay-image");

    // Se manca l'overlay o l'immagine grande, esco senza errori
    if (!overlay || !overlayImage) return;
    if (!zoomableImages.length) return;

    // Clic sulle immagini piccole
    zoomableImages.forEach(img => {
        img.addEventListener("click", () => {
            overlayImage.src = img.src;
            overlayImage.alt = img.alt || "Immagine ingrandita";
            overlay.classList.remove("hidden");
        });
    });

    // Clic sull'overlay per chiudere
    overlay.addEventListener("click", () => {
        overlay.classList.add("hidden");
        overlayImage.src = "";
    });
}

// Inizializzazione globale
document.addEventListener("DOMContentLoaded", () => {
    initThemeSelector();
    initImageZoom();
});


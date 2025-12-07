// script-common.js
// Funzioni condivise per tutte le pagine "interne" del Libro.0

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCurrentSection();
  initHighlights();
  initNotes();
  initDestinations();
  initToolsNav();
  initImageZoom();
});

/* ---------- Tema A–E ---------- */

const THEME_KEY = "libro0-theme";

function applyTheme(theme) {
  const allowed = ["A", "B", "C", "D", "E"];
  if (!allowed.includes(theme)) return;
  document.body.classList.remove(
    "theme-A",
    "theme-B",
    "theme-C",
    "theme-D",
    "theme-E"
  );
  document.body.classList.add(`theme-${theme}`);
}

function initTheme() {
  let theme = localStorage.getItem(THEME_KEY) || "A";
  applyTheme(theme);
  localStorage.setItem(THEME_KEY, theme);

  const buttons = document.querySelectorAll(".theme-switcher button[data-theme]");
  buttons.forEach((btn) => {
    const t = btn.getAttribute("data-theme");
    if (t === theme) {
      btn.style.outline = "2px solid #fff";
    }

    btn.addEventListener("click", () => {
      const newTheme = btn.getAttribute("data-theme");
      if (!newTheme) return;
      applyTheme(newTheme);
      localStorage.setItem(THEME_KEY, newTheme);
      buttons.forEach((b) => (b.style.outline = "none"));
      btn.style.outline = "2px solid #fff";
    });
  });
}

/* ---------- Sezione attuale & capitolo attivo ---------- */

function initCurrentSection() {
  const sectionNameSpan = document.getElementById("current-section-name");
  const body = document.body;
  const sectionId = body.dataset.section;

  // Titolo dalla pagina
  const headerTitle = document.querySelector(".section-header h1");
  if (sectionNameSpan && headerTitle) {
    sectionNameSpan.textContent = headerTitle.textContent.trim();
  }

  // Evidenzia capitolo corrente
  if (sectionId) {
    const link = document.querySelector(
      `.chapter-link[data-chapter="${sectionId}"]`
    );
    if (link) {
      link.classList.add("is-current");
    }
  }
}

/* ---------- Evidenziazione ---------- */

function initHighlights() {
  const highlightBtn = document.getElementById("btn-highlight");
  const clearBtn = document.getElementById("btn-clear-highlights");
  const lesson = document.querySelector(".lesson-text");

  if (!lesson || !highlightBtn || !clearBtn) return;

  highlightBtn.addEventListener("click", () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    if (!lesson.contains(range.commonAncestorContainer)) {
      return; // selezione fuori dal testo
    }

    try {
      const span = document.createElement("span");
      span.className = "highlighted";
      range.surroundContents(span);
      selection.removeAllRanges();
    } catch (e) {
      console.warn("Evidenziazione non applicabile a questa selezione.");
    }
  });

  clearBtn.addEventListener("click", () => {
    const highlights = lesson.querySelectorAll("span.highlighted");
    highlights.forEach((span) => {
      const parent = span.parentNode;
      while (span.firstChild) parent.insertBefore(span.firstChild, span);
      parent.removeChild(span);
    });
  });
}

/* ---------- Note rapide ---------- */

function initNotes() {
  const textarea = document.getElementById("note-input");
  const saveBtn = document.getElementById("btn-save-note");
  const list = document.getElementById("note-list");
  if (!textarea || !saveBtn || !list) return;

  const sectionId = document.body.dataset.section || "generale";
  const NOTES_KEY = `libro0-notes-${sectionId}`;

  function renderNotes() {
    list.innerHTML = "";
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return;
    let notes;
    try {
      notes = JSON.parse(raw);
    } catch {
      notes = [];
    }
    notes.forEach((text, index) => {
      const li = document.createElement("li");
      li.textContent = text;

      li.addEventListener("click", () => {
        // click per cancellare velocemente
        notes.splice(index, 1);
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
        renderNotes();
      });

      list.appendChild(li);
    });
  }

  renderNotes();

  saveBtn.addEventListener("click", () => {
    const value = textarea.value.trim();
    if (!value) return;
    const raw = localStorage.getItem(NOTES_KEY);
    const notes = raw ? JSON.parse(raw) : [];
    notes.push(value);
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    textarea.value = "";
    renderNotes();
  });
}

/* ---------- Invio a... (mappa, timeline, ecc.) ---------- */

function openModal(contentHtml) {
  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("modal-content");
  const closeBtn = document.getElementById("modal-close");
  if (!overlay || !content || !closeBtn) return;

  content.innerHTML = contentHtml;
  overlay.hidden = false;

  const onClose = () => {
    overlay.hidden = true;
    content.innerHTML = "";
    closeBtn.removeEventListener("click", onClose);
    overlay.removeEventListener("click", overlayClick);
  };

  const overlayClick = (e) => {
    if (e.target === overlay) onClose();
  };

  closeBtn.addEventListener("click", onClose);
  overlay.addEventListener("click", overlayClick);
}

function initDestinations() {
  const chips = document.querySelectorAll(".margin-chip[data-destination]");
  if (!chips.length) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const dest = chip.getAttribute("data-destination");
      const pretty =
        dest === "mappa"
          ? "mappa concettuale"
          : dest === "timeline"
          ? "timeline"
          : dest === "lavagna"
          ? "lavagna"
          : "archivio personale";

      openModal(`
        <h2>Azione registrata</h2>
        <p>Hai deciso di inviare questa sezione alla <strong>${pretty}</strong>.</p>
        <p>Nelle versioni successive del Libro.0 questo gesto potrà aprire direttamente
        la stanza corrispondente e precompilare nodi, eventi o note.</p>
      `);
    });
  });
}

/* ---------- Strumenti in alto ---------- */

function initToolsNav() {
  const buttons = document.querySelectorAll(".tool-btn[data-tool]");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tool = btn.getAttribute("data-tool");
      const label =
        tool === "mappe"
          ? "Mappe concettuali"
          : tool === "lavagna"
          ? "Lavagna"
          : "Archivio personale";

      openModal(`
        <h2>${label}</h2>
        <p>Questa è una <strong>versione prototipo</strong> del Libro.0.</p>
        <p>In una fase successiva, questo pulsante aprirà una stanza dedicata dove
        potrai lavorare direttamente su mappe, lavagne o archivio, senza uscire dal libro.</p>
      `);
    });
  });
}

/* ---------- Zoom sulle immagini ---------- */

function initImageZoom() {
  const images = document.querySelectorAll("img.enlargeable");
  if (!images.length) return;

  images.forEach((img) => {
    img.addEventListener("click", () => {
      const src = img.getAttribute("src");
      const alt = img.getAttribute("alt") || "Immagine";

      openModal(`
        <img src="${src}" alt="${alt}" class="modal-image" />
      `);
    });
  });
}


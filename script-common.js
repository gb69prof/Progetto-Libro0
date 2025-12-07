
/**
 * script-common.js
 * Funzioni condivise per il Libro.0 – Pascoli
 * - Temi A–E
 * - Evidenziazione testo
 * - Note rapide per sezione
 * - Attivazione capitolo corrente
 * - Pulsanti "Invia a..."
 * - Zoom immagini (classe .enlargeable) tramite modale
 */

const THEME_KEY = "libro0-theme";
const NOTES_KEY_PREFIX = "libro0-notes-";

/* ---------------------- Temi A–E ---------------------- */

function applyTheme(theme) {
  const body = document.body;
  const allowed = ["A","B","C","D","E"];
  body.classList.remove("theme-A","theme-B","theme-C","theme-D","theme-E");
  if (allowed.includes(theme)) {
    body.classList.add(`theme-${theme}`);
  }
}

function initThemes() {
  const buttons = document.querySelectorAll(".theme-switcher button[data-theme]");
  if (!buttons.length) return;

  let current = localStorage.getItem(THEME_KEY) || "A";
  applyTheme(current);

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const t = btn.getAttribute("data-theme") || "A";
      localStorage.setItem(THEME_KEY, t);
      applyTheme(t);
    });
  });
}

/* ---------------------- Capitolo attivo ---------------------- */

function initActiveChapter() {
  const sectionId = document.body.dataset.section;
  if (!sectionId) return;

  const link = document.querySelector(`.chapter-link[data-chapter="${sectionId}"]`);
  if (link) {
    link.classList.add("active");
  }

  const h1 = document.querySelector(".section-header h1");
  const labelSpan = document.getElementById("current-section-name");
  if (h1 && labelSpan) {
    labelSpan.textContent = h1.textContent.trim();
  }
}

/* ---------------------- Evidenziazioni ---------------------- */

function highlightSelection() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  const container = findAncestor(range.commonAncestorContainer, el =>
    el.classList && el.classList.contains("lesson-text")
  );
  if (!container) return;

  const span = document.createElement("span");
  span.className = "highlight";
  range.surroundContents(span);
  selection.removeAllRanges();
}

function clearHighlights() {
  const container = document.querySelector(".lesson-text");
  if (!container) return;
  const highlights = container.querySelectorAll("span.highlight");
  highlights.forEach(span => {
    const parent = span.parentNode;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
  });
}

function initHighlightButtons() {
  const btnHighlight = document.getElementById("btn-highlight");
  const btnClear = document.getElementById("btn-clear-highlights");
  if (btnHighlight) {
    btnHighlight.addEventListener("click", highlightSelection);
  }
  if (btnClear) {
    btnClear.addEventListener("click", clearHighlights);
  }
}

/* ---------------------- Note rapide ---------------------- */

function getNotesStorageKey() {
  const sectionId = document.body.dataset.section || "index";
  return NOTES_KEY_PREFIX + sectionId;
}

function loadNotes() {
  const key = getNotesStorageKey();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  const key = getNotesStorageKey();
  localStorage.setItem(key, JSON.stringify(notes));
}

function renderNotes() {
  const ul = document.getElementById("note-list");
  if (!ul) return;
  ul.innerHTML = "";
  const notes = loadNotes();
  notes.forEach((n, idx) => {
    const li = document.createElement("li");
    li.textContent = n;
    li.dataset.index = String(idx);
    ul.appendChild(li);
  });
}

function initNotes() {
  const textarea = document.getElementById("note-input");
  const btnSave = document.getElementById("btn-save-note");
  if (!textarea || !btnSave) return;

  renderNotes();

  btnSave.addEventListener("click", () => {
    const value = textarea.value.trim();
    if (!value) return;
    const notes = loadNotes();
    notes.push(value);
    saveNotes(notes);
    textarea.value = "";
    renderNotes();
  });
}

/* ---------------------- Pulsanti "Invia a..." ---------------------- */

function initSendButtons() {
  const chips = document.querySelectorAll(".margin-chip[data-destination]");
  if (!chips.length) return;
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const dest = chip.getAttribute("data-destination");
      if (!dest) return;
      console.log(`Invia a: ${dest}`);
      alert("Ho registrato che vuoi inviare questa sezione a: " + dest + ".\nNelle versioni future sarà collegato a strumenti reali.");
    });
  });
}

/* ---------------------- Zoom immagini con modale ---------------------- */

function initImageZoom() {
  const images = document.querySelectorAll("img.enlargeable");
  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("modal-content");
  const closeBtn = document.getElementById("modal-close");

  if (!images.length || !overlay || !content || !closeBtn) return;

  const openWithSrc = (src, alt) => {
    content.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "modal-image-wrapper";
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    wrapper.appendChild(img);
    content.appendChild(wrapper);
    overlay.hidden = false;

    img.addEventListener("click", () => {
      overlay.hidden = true;
      content.innerHTML = "";
    }, { once: true });
  };

  images.forEach(img => {
    img.addEventListener("click", () => {
      openWithSrc(img.src, img.alt);
    });
  });

  closeBtn.addEventListener("click", () => {
    overlay.hidden = true;
    content.innerHTML = "";
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.hidden = true;
      content.innerHTML = "";
    }
  });
}

/* ---------------------- Utility ---------------------- */

function findAncestor(node, predicate) {
  let current = node;
  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE && predicate(current)) {
      return current;
    }
    current = current.parentNode;
  }
  return null;
}

/* ---------------------- Init globale ---------------------- */

document.addEventListener("DOMContentLoaded", () => {
  initThemes();
  initActiveChapter();
  initHighlightButtons();
  initNotes();
  initSendButtons();
  initImageZoom();
});

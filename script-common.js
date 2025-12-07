document.addEventListener("DOMContentLoaded", () => {
  const sectionId = document.body.dataset.section || "generico";

  // ===== Temi A–E (condivisi) =====
  const themeButtons = document.querySelectorAll(".theme-switcher button");
  const savedTheme = localStorage.getItem("libro0_theme");
  if (savedTheme) {
    document.body.classList.add(`theme-${savedTheme}`);
  } else {
    document.body.classList.add("theme-A");
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      document.body.classList.remove("theme-A", "theme-B", "theme-C", "theme-D", "theme-E");
      document.body.classList.add(`theme-${theme}`);
      localStorage.setItem("libro0_theme", theme);
    });
  });

  // ===== Sidebar: evidenzia sezione corrente =====
  const chapterLinks = document.querySelectorAll(".chapter-link");
  chapterLinks.forEach((link) => {
    if (link.dataset.chapter === sectionId) {
      link.classList.add("active");
    }
  });

  // ===== Etichetta sezione corrente =====
  const sectionNames = {
    stupore: "Lo stupore",
    visione: "Visione del mondo",
    fanciullino: "Poetica del fanciullino",
    forma: "La forma",
    simbolismo: "Il simbolismo",
  };
  const sectionLabel = document.getElementById("current-section-name");
  if (sectionLabel && sectionNames[sectionId]) {
    sectionLabel.textContent = sectionNames[sectionId];
  }

  // ===== Evidenziazioni =====
  const highlightBtn = document.getElementById("btn-highlight");
  const clearHighlightsBtn = document.getElementById("btn-clear-highlights");
  const lessonText = document.querySelector(".lesson-text");

  function applySavedHighlights() {
    if (!lessonText) return;
    const saved = localStorage.getItem(`libro0_pascoli_highlights_${sectionId}`);
    if (saved) {
      lessonText.innerHTML = saved;
    }
  }

  applySavedHighlights();

  if (highlightBtn && lessonText) {
    highlightBtn.addEventListener("click", () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);

      if (!lessonText.contains(range.commonAncestorContainer)) {
        return;
      }

      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      span.style.padding = "0 1px";

      try {
        range.surroundContents(span);
        selection.removeAllRanges();
        localStorage.setItem(`libro0_pascoli_highlights_${sectionId}`, lessonText.innerHTML);
      } catch (e) {
        console.warn("Impossibile evidenziare il frammento selezionato:", e);
      }
    });
  }

  if (clearHighlightsBtn && lessonText) {
    clearHighlightsBtn.addEventListener("click", () => {
      // Ricarica il testo rimuovendo gli span: per semplicità si riparte dal testo attuale senza highlight salvato
      lessonText.querySelectorAll("span").forEach((el) => {
        if (el.style.backgroundColor === "yellow") {
          const parent = el.parentNode;
          while (el.firstChild) parent.insertBefore(el.firstChild, el);
          parent.removeChild(el);
        }
      });
      localStorage.removeItem(`libro0_pascoli_highlights_${sectionId}`);
    });
  }

  // ===== Note rapide =====
  const noteInput = document.getElementById("note-input");
  const noteList = document.getElementById("note-list");
  const saveNoteBtn = document.getElementById("btn-save-note");

  function loadNotes() {
    if (!noteList) return;
    noteList.innerHTML = "";
    const saved = JSON.parse(localStorage.getItem(`libro0_pascoli_note_${sectionId}`) || "[]");
    saved.forEach((text, index) => {
      const li = document.createElement("li");
      li.textContent = text;
      li.addEventListener("click", () => {
        // click per cancellare una nota
        const updated = saved.filter((_, i) => i !== index);
        localStorage.setItem(`libro0_pascoli_note_${sectionId}`, JSON.stringify(updated));
        loadNotes();
      });
      noteList.appendChild(li);
    });
  }

  loadNotes();

  if (saveNoteBtn && noteInput && noteList) {
    saveNoteBtn.addEventListener("click", () => {
      const value = noteInput.value.trim();
      if (!value) return;
      const saved = JSON.parse(localStorage.getItem(`libro0_pascoli_note_${sectionId}`) || "[]");
      saved.unshift(value);
      localStorage.setItem(`libro0_pascoli_note_${sectionId}`, JSON.stringify(saved));
      noteInput.value = "";
      loadNotes();
    });
  }

  // ===== Invia a... (log intenzioni) =====
  const chips = document.querySelectorAll(".margin-chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const dest = chip.dataset.destination;
      const key = `libro0_pascoli_actions_${sectionId}`;
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      saved.push({
        destination: dest,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(saved));
      chip.classList.add("clicked");
      setTimeout(() => chip.classList.remove("clicked"), 180);
    });
  });

  // ===== Tool buttons (Mappe, Lavagna, Archivio) =====
  const toolButtons = document.querySelectorAll(".tool-btn");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");

  function openModal(title, body) {
    if (!modalOverlay || !modalContent) return;
    modalContent.innerHTML = `<h2>${title}</h2><p>${body}</p>`;
    modalOverlay.hidden = false;
  }

  toolButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tool = btn.dataset.tool;
      if (tool === "mappe") {
        openModal(
          "Mappe concettuali",
          "In una versione avanzata del Libro.0 qui potrai generare una mappa concettuale a partire dalle evidenziazioni e dalle note di questa sezione."
        );
      } else if (tool === "lavagna") {
        openModal(
          "Lavagna",
          "Qui comparirà una lavagna digitale dove disegnare schemi, frecce, collegamenti tra concetti di Pascoli."
        );
      } else if (tool === "archivio") {
        openModal(
          "Archivio personale",
          "Qui potrai consultare la memoria lunga del tuo studio: note, azioni 'invia a...', evidenziazioni."
        );
      }
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener("click", () => (modalOverlay.hidden = true));
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) modalOverlay.hidden = true;
    });
  }
});

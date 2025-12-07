document.addEventListener("DOMContentLoaded", () => {
  const sectionId = document.body.dataset.section || "generico";

  /* ===== Temi A–E ===== */
  const themeButtons = document.querySelectorAll(".theme-switcher button");
  const savedTheme = localStorage.getItem("libro0_theme") || "A";

  function applyTheme(theme) {
    document.body.classList.remove(
      "theme-A",
      "theme-B",
      "theme-C",
      "theme-D",
      "theme-E"
    );
    document.body.classList.add(`theme-${theme}`);
  }

  applyTheme(savedTheme);

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      applyTheme(theme);
      localStorage.setItem("libro0_theme", theme);
    });
  });

  /* ===== Sidebar: evidenzia sezione corrente ===== */
  const chapterLinks = document.querySelectorAll(".chapter-link");
  chapterLinks.forEach((link) => {
    if (link.dataset.chapter === sectionId) {
      link.classList.add("active");
    }
  });

  /* ===== Etichetta sezione corrente nel margine ===== */
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

  /* ===== Evidenziazione testo ===== */
  const highlightBtn = document.getElementById("btn-highlight");
  const clearHighlightsBtn = document.getElementById("btn-clear-highlights");
  const lessonText = document.querySelector(".lesson-text");

  function loadHighlights() {
    if (!lessonText) return;
    const saved = localStorage.getItem(
      `libro0_pascoli_highlights_${sectionId}`
    );
    if (saved) {
      lessonText.innerHTML = saved;
    }
  }

  function saveHighlights() {
    if (!lessonText) return;
    localStorage.setItem(
      `libro0_pascoli_highlights_${sectionId}`,
      lessonText.innerHTML
    );
  }

  loadHighlights();

  if (highlightBtn && lessonText) {
    highlightBtn.addEventListener("click", () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0);
      if (!lessonText.contains(range.commonAncestorContainer)) return;
      if (range.collapsed) return;

      const span = document.createElement("span");
      span.setAttribute("data-highlight", "true");

      try {
        range.surroundContents(span);
        sel.removeAllRanges();
        saveHighlights();
      } catch (e) {
        console.warn("Impossibile evidenziare il frammento selezionato:", e);
      }
    });
  }

  if (clearHighlightsBtn && lessonText) {
    clearHighlightsBtn.addEventListener("click", () => {
      lessonText
        .querySelectorAll('span[data-highlight="true"]')
        .forEach((el) => {
          const parent = el.parentNode;
          while (el.firstChild) parent.insertBefore(el.firstChild, el);
          parent.removeChild(el);
        });
      localStorage.removeItem(`libro0_pascoli_highlights_${sectionId}`);
    });
  }

  /* ===== Note rapide nel margine ===== */
  const noteInput = document.getElementById("note-input");
  const noteList = document.getElementById("note-list");
  const saveNoteBtn = document.getElementById("btn-save-note");

  function loadNotes() {
    if (!noteList) return;
    noteList.innerHTML = "";
    const saved = JSON.parse(
      localStorage.getItem(`libro0_pascoli_note_${sectionId}`) || "[]"
    );
    saved.forEach((text, index) => {
      const li = document.createElement("li");
      li.textContent = text;
      li.title = "Clicca per cancellare la nota";
      li.addEventListener("click", () => {
        const updated = saved.filter((_, i) => i !== index);
        localStorage.setItem(
          `libro0_pascoli_note_${sectionId}`,
          JSON.stringify(updated)
        );
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
      const saved = JSON.parse(
        localStorage.getItem(`libro0_pascoli_note_${sectionId}`) || "[]"
      );
      saved.unshift(value);
      localStorage.setItem(
        `libro0_pascoli_note_${sectionId}`,
        JSON.stringify(saved)
      );
      noteInput.value = "";
      loadNotes();
    });
  }

  /* ===== Invia a... (log intenzioni) ===== */
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

  /* ===== Tool buttons (Mappe, Lavagna, Archivio) ===== */
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
          "Qui potrai generare una mappa concettuale a partire da evidenziazioni e note di questa sezione."
        );
      } else if (tool === "lavagna") {
        openModal(
          "Lavagna",
          "Qui vedrai una lavagna digitale dove disegnare schemi e collegamenti tra concetti."
        );
      } else if (tool === "archivio") {
        openModal(
          "Archivio personale",
          "Qui ritroverai la memoria lunga del tuo studio: note, evidenziazioni, azioni 'invia a...'."
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

  /* ===== Lightbox immagini (ingrandimento a pieno schermo) ===== */
  document.querySelectorAll("img.enlargeable").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.className = "lightbox-overlay";
      overlay.innerHTML = `<img src="${img.src}" alt="">`;
      overlay.addEventListener("click", () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cover = document.getElementById("pascoli-cover");
  const videoBox = document.getElementById("video-container");
  const backBtn = document.getElementById("btn-back-to-cover");

  if (cover && videoBox) {
    cover.addEventListener("click", () => {
      cover.parentElement.hidden = true;
      videoBox.hidden = false;
    });
  }

  if (backBtn && cover) {
    backBtn.addEventListener("click", () => {
      videoBox.hidden = true;
      cover.parentElement.hidden = false;
    });
  }

  // Theme handling (shared logic)
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

  // Placeholder handlers for tools (Mappe, Lavagna, Archivio)
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
        openModal("Mappe concettuali", "Qui potrai collegare gli appunti a una mappa concettuale interna al Libro.0.");
      } else if (tool === "lavagna") {
        openModal("Lavagna", "Qui comparirà una lavagna digitale per schemi veloci e disegni a mano.");
      } else if (tool === "archivio") {
        openModal("Archivio personale", "Qui potrai ritrovare note, evidenziazioni e collegamenti creati nelle varie sezioni.");
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

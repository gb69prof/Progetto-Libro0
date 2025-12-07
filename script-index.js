// script-index.js
// Logica specifica della pagina index (video copertina)

document.addEventListener("DOMContentLoaded", () => {
  initThemeIndex();
  initCoverVideo();
});

/* Usa la stessa chiave del tema di script-common */
const THEME_KEY = "libro0-theme";

function applyThemeIndex(theme) {
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

function initThemeIndex() {
  let theme = localStorage.getItem(THEME_KEY) || "A";
  applyThemeIndex(theme);
  localStorage.setItem(THEME_KEY, theme);

  const buttons = document.querySelectorAll(".theme-switcher button[data-theme]");
  buttons.forEach((btn) => {
    const t = btn.getAttribute("data-theme");
    if (t === theme) btn.style.outline = "2px solid #fff";

    btn.addEventListener("click", () => {
      const newTheme = btn.getAttribute("data-theme");
      if (!newTheme) return;
      applyThemeIndex(newTheme);
      localStorage.setItem(THEME_KEY, newTheme);
      buttons.forEach((b) => (b.style.outline = "none"));
      btn.style.outline = "2px solid #fff";
    });
  });
}

function initCoverVideo() {
  const coverImg = document.getElementById("pascoli-cover");
  const coverWrapper = document.getElementById("cover-wrapper");
  const videoContainer = document.getElementById("video-container");
  const backBtn = document.getElementById("btn-back-to-cover");
  if (!coverImg || !coverWrapper || !videoContainer || !backBtn) return;

  const showVideo = () => {
    coverWrapper.hidden = true;
    videoContainer.hidden = false;
  };

  const showCover = () => {
    coverWrapper.hidden = false;
    videoContainer.hidden = true;
  };

  coverImg.addEventListener("click", showVideo);
  backBtn.addEventListener("click", showCover);
}

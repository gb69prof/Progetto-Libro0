// --- SISTEMA TEMI LIBRO.0 ---

function setTheme(theme) {
  document.body.classList.remove("theme-A", "theme-B", "theme-C", "theme-D", "theme-E");
  document.body.classList.add(theme);
  localStorage.setItem("libro0-theme", theme);
}

function loadSavedTheme() {
  const saved = localStorage.getItem("libro0-theme");
  if (saved) {
    document.body.classList.add(saved);
  } else {
    document.body.classList.add("theme-A"); // Tema predefinito
  }
}

document.addEventListener("DOMContentLoaded", loadSavedTheme);

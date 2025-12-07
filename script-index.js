
/**
 * script-index.js
 * Home Pascoli – gestione copertina / video introduttivo
 */

document.addEventListener("DOMContentLoaded", () => {
  const cover = document.getElementById("pascoli-cover");
  const coverWrapper = document.getElementById("cover-wrapper");
  const videoContainer = document.getElementById("video-container");
  const backBtn = document.getElementById("btn-back-to-cover");

  if (cover && coverWrapper && videoContainer) {
    cover.addEventListener("click", () => {
      coverWrapper.hidden = true;
      videoContainer.hidden = false;
    });
  }

  if (backBtn && coverWrapper && videoContainer) {
    backBtn.addEventListener("click", () => {
      videoContainer.hidden = true;
      coverWrapper.hidden = false;
    });
  }
});

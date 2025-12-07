
// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Simple zoom on images with .zoomable
const zoomables = document.querySelectorAll('.zoomable');

zoomables.forEach(img => {
  img.addEventListener('click', () => {
    img.classList.toggle('fullscreen');
  });
});

// Close fullscreen image with ESC
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.zoomable.fullscreen').forEach(img => {
      img.classList.remove('fullscreen');
    });
  }
});

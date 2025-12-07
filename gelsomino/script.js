document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.toggle-analisi');
  toggles.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      const box = document.getElementById(targetId);
      if (!box) return;
      const isOpen = box.classList.toggle('open');
      if (isOpen) {
        button.textContent = 'Nascondi analisi';
      } else {
        button.textContent = 'Mostra / nascondi analisi';
      }
    });
  });

  const realityFigures = document.querySelectorAll('.stanza-images figure.reality');
  realityFigures.forEach(fig => {
    fig.addEventListener('click', () => {
      fig.classList.remove('reality-locked');
    });
  });

  // Smooth scroll per la navigazione in cima
  document.querySelectorAll('.top-nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});

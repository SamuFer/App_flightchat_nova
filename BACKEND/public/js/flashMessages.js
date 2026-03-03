document.addEventListener('DOMContentLoaded', () => {
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(msg => {
      setTimeout(() => {
        msg.classList.add('fade-out');
        setTimeout(() => msg.remove(), 500); // elimina tras transición
      }, 5000);
    });
  });
  
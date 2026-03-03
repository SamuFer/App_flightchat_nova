// password-toggle.js
document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('contrasenya');
    const toggleBtn = document.getElementById('togglePassword');
    const icon = document.getElementById('iconPassword');
  
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
  
      // Alternar íconos si usas Bootstrap Icons
      if (icon) {
        icon.classList.toggle('bi-eye');
        icon.classList.toggle('bi-eye-slash');
      }
    });
  });
  
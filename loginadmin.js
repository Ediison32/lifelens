document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('error');

  form?.addEventListener('submit', function (e) {
    e.preventDefault();
    errorEl.textContent = '';

    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;

    const ADMIN_USER = 'belabs@riwi.com';
    const ADMIN_PASS = 'admin123';

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      // guardamos sesión sessionStorage
      const authData = { user: user, role: 'admin', ts: Date.now() };
      sessionStorage.setItem('belabs_auth', JSON.stringify(authData));

      // debug opcional
      console.log('Login OK — redirigiendo a admin.html', authData);

      // redirigimos al panel
      window.location.assign('admin.html');
    } else {
      errorEl.textContent = 'Usuario o contraseña incorrectos';
    }
  });
});

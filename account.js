// account.js

const API_BASE_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
  ? 'http://localhost:3001/api'
  : 'https://backend-anber.onrender.com/api'; // Adapt if the render url is different

document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();

  // Login event
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
          localStorage.setItem('anber_token', data.token);
          window.location.reload();
        } else {
          document.getElementById('loginError').textContent = data.error || "Erreur de connexion";
        }
      } catch (err) {
        document.getElementById('loginError').textContent = "Erreur serveur";
      }
    });
  }

  // Register event
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstName = document.getElementById('regFirstName').value;
      const lastName = document.getElementById('regLastName').value;
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;
      
      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, email, password })
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
          localStorage.setItem('anber_token', data.token);
          window.location.reload();
        } else {
          document.getElementById('registerError').textContent = data.error || "Erreur d'inscription";
        }
      } catch (err) {
        document.getElementById('registerError').textContent = "Erreur serveur";
      }
    });
  }
});

function toggleAuth(type) {
  const loginSect = document.getElementById('loginFormSection');
  const regSect = document.getElementById('registerFormSection');
  
  if (type === 'register') {
    loginSect.style.display = 'none';
    regSect.style.display = 'block';
  } else {
    regSect.style.display = 'none';
    loginSect.style.display = 'block';
  }
}

async function checkAuthStatus() {
  const token = localStorage.getItem('anber_token');
  const authContainer = document.getElementById('authContainer');
  const vipDashboard = document.getElementById('vipDashboard');

  if (!token) {
    authContainer.style.display = 'block';
    vipDashboard.style.display = 'none';
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    
    if (res.ok && data.success && data.user) {
      authContainer.style.display = 'none';
      vipDashboard.style.display = 'block';
      renderVipCard(data.user);
    } else {
      // Token exists but invalid
      logout();
    }
  } catch (err) {
    console.error('Auth error', err);
  }
}

function renderVipCard(user) {
  document.getElementById('vipName').textContent = `${user.firstName} ${user.lastName}`;
  document.getElementById('vipPoints').textContent = user.points || 0;
  
  let level = "Membre Privilège";
  if (user.points >= 50) level = "Membre Or";
  if (user.points >= 150) level = "Membre Diamant";
  if (user.points >= 500) level = "Membre Noir (Black)";

  const vipLevelEl = document.getElementById('vipLevel');
  vipLevelEl.textContent = level;
  
  if (level === "Membre Diamant" || level === "Membre Noir (Black)") {
     vipLevelEl.style.color = '#fff';
     vipLevelEl.style.background = '#333';
     vipLevelEl.style.borderColor = '#555';
  }
}

function logout() {
  localStorage.removeItem('anber_token');
  window.location.reload();
}

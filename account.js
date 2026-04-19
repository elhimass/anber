// account.js — Espace Client VIP Anber

const API_BASE = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
  ? 'http://localhost:3001/api'
  : 'https://backend-anber.onrender.com/api';

// Replace with your Google Cloud Console Client ID
const GOOGLE_CLIENT_ID = ''; // ex: '1234567890-abc.apps.googleusercontent.com'

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initGoogleSignIn();
});

function initAuth() {
  const token = localStorage.getItem('anber_token');
  if (token) {
    loadDashboard(token);
  } else {
    showAuth();
  }

  // Login submit
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const errEl = document.getElementById('loginError');
      errEl.textContent = '';

      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          localStorage.setItem('anber_token', data.token);
          window.location.reload();
        } else {
          errEl.textContent = data.error || 'Erreur de connexion';
        }
      } catch (err) {
        errEl.textContent = 'Erreur serveur. Réessayez.';
      }
    });
  }

  // Register submit
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstName = document.getElementById('regFirstName').value;
      const lastName = document.getElementById('regLastName').value;
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;
      const errEl = document.getElementById('registerError');
      errEl.textContent = '';

      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          localStorage.setItem('anber_token', data.token);
          window.location.reload();
        } else {
          errEl.textContent = data.error || "Erreur d'inscription";
        }
      } catch (err) {
        errEl.textContent = 'Erreur serveur. Réessayez.';
      }
    });
  }
}

// ===== GOOGLE SIGN-IN =====
function initGoogleSignIn() {
  if (!GOOGLE_CLIENT_ID || typeof google === 'undefined') return;
  try {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
    });
    google.accounts.id.renderButton(
      document.getElementById('googleSignInDiv'),
      { theme: 'filled_black', size: 'large', width: 300, text: 'continue_with', shape: 'pill' }
    );
  } catch (e) {
    console.log('Google Sign-In unavailable');
  }
}

async function handleGoogleCredential(response) {
  try {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      localStorage.setItem('anber_token', data.token);
      window.location.reload();
    } else {
      document.getElementById('loginError').textContent = data.error || 'Erreur Google';
    }
  } catch (err) {
    document.getElementById('loginError').textContent = 'Erreur serveur';
  }
}

// ===== UI SWITCHING =====
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

  if (tab === 'login') {
    document.querySelector('.auth-tab:first-child').classList.add('active');
    document.getElementById('loginForm').classList.add('active');
  } else {
    document.querySelector('.auth-tab:last-child').classList.add('active');
    document.getElementById('registerForm').classList.add('active');
  }
}

function switchDashTab(tab) {
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));

  const tabs = document.querySelectorAll('.dash-tab');
  const map = { card: 0, orders: 1, profile: 2 };
  tabs[map[tab]].classList.add('active');
  document.getElementById(`panel-${tab}`).classList.add('active');

  if (tab === 'orders') loadOrders();
}

function showAuth() {
  const auth = document.getElementById('authContainer');
  const dash = document.getElementById('dashboard');
  if (auth) auth.style.display = 'block';
  if (dash) dash.style.display = 'none';
}

// ===== DASHBOARD =====
async function loadDashboard(token) {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (res.ok && data.success && data.user) {
      document.getElementById('authContainer').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      renderDashboard(data.user);
    } else {
      logout();
    }
  } catch (err) {
    console.error('Dashboard load error', err);
  }
}

function renderDashboard(user) {
  const { firstName, lastName, email, points, userCode, createdAt } = user;
  const level = getLevel(points);

  // Header
  document.getElementById('dashName').textContent = firstName;

  // VIP Card
  document.getElementById('cardCode').textContent = userCode || 'ANB-XXXXXX';
  document.getElementById('cardName').textContent = `${firstName} ${lastName}`.toUpperCase();
  document.getElementById('cardPoints').textContent = points || 0;
  document.getElementById('cardLevel').textContent = level.name;

  // QR Code (uses free API)
  const qrData = encodeURIComponent(`ANBER-VIP:${userCode}:${email}`);
  document.getElementById('cardQr').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&bgcolor=ffffff&color=000000`;

  // Stats
  document.getElementById('statPoints').textContent = points || 0;
  document.getElementById('statLevel').textContent = level.short;

  // Profile tab
  document.getElementById('profFirstName').textContent = firstName;
  document.getElementById('profLastName').textContent = lastName;
  document.getElementById('profEmail').textContent = email;
  document.getElementById('profCode').textContent = userCode || '—';
  document.getElementById('profLevel').textContent = level.name;
  document.getElementById('profPoints').textContent = `${points || 0} points`;

  if (createdAt) {
    document.getElementById('profSince').textContent = new Date(createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  }

  // Progress bar
  const nextLevel = level.next;
  if (nextLevel) {
    const progress = Math.min(100, ((points - level.min) / (nextLevel.min - level.min)) * 100);
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressCurrent').textContent = `${points} pts`;
    document.getElementById('progressTarget').textContent = `${nextLevel.min} pts (${nextLevel.name})`;
  } else {
    document.getElementById('progressFill').style.width = '100%';
    document.getElementById('progressCurrent').textContent = `${points} pts`;
    document.getElementById('progressTarget').textContent = 'Niveau max atteint !';
  }
}

function getLevel(points) {
  const levels = [
    { name: 'Membre Argent', short: 'Argent', min: 0, next: null },
    { name: 'Membre Or', short: 'Or', min: 50, next: null },
    { name: 'Membre Platine', short: 'Platine', min: 200, next: null },
    { name: 'Membre Diamant', short: 'Diamant', min: 500, next: null },
    { name: 'Membre Noir', short: 'Noir', min: 1000, next: null },
  ];

  let current = levels[0];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].min) {
      current = levels[i];
      current.next = levels[i + 1] || null;
      break;
    }
  }
  return current;
}

// ===== ORDERS =====
async function loadOrders() {
  const token = localStorage.getItem('anber_token');
  if (!token) return;

  const container = document.getElementById('ordersContainer');

  try {
    const res = await fetch(`${API_BASE}/auth/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (res.ok && data.success) {
      document.getElementById('statOrders').textContent = data.orders.length;

      if (data.orders.length === 0) {
        container.innerHTML = `
          <div class="orders-empty">
            <p style="font-size:2rem; margin-bottom:15px;">📦</p>
            <p>Aucune commande pour le moment.</p>
            <a href="products.html" class="btn" style="margin-top:20px; display:inline-block;">Découvrir la collection</a>
          </div>
        `;
        return;
      }

      container.innerHTML = data.orders.map(order => {
        const statusLabels = { pending: 'En attente', confirmed: 'Confirmée', shipped: 'Expédiée', delivered: 'Livrée' };
        const date = new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

        const itemsHtml = order.items.map(item => `
          <div class="order-item">
            <span class="order-item-name">${item.name}</span>
            <span class="order-item-size">${item.size} × ${item.quantity}</span>
            <span class="order-item-price">${(item.price * item.quantity).toFixed(0)} MAD</span>
          </div>
        `).join('');

        return `
          <div class="order-card">
            <div class="order-header">
              <span class="order-num">${order.orderNumber}</span>
              <span class="order-date">${date}</span>
              <span class="order-status ${order.status}">${statusLabels[order.status] || order.status}</span>
            </div>
            <div class="order-items">${itemsHtml}</div>
            <div class="order-footer">
              <span class="order-points">+${order.pointsEarned || 0} points gagnés</span>
              <span class="order-total">${order.totalAmount.toFixed(0)} MAD</span>
            </div>
          </div>
        `;
      }).join('');
    }
  } catch (err) {
    container.innerHTML = '<div class="orders-empty">Erreur de chargement</div>';
  }
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem('anber_token');
  window.location.reload();
}

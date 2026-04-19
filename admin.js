const API_URL = 'https://backendanber.onrender.com/api'; // Modifier pour du dev local si besoin

// --- LOGIN LOGIC ---
const loginOverlay = document.getElementById('loginOverlay');
const adminPanel = document.getElementById('adminPanel');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const pwdInput = document.getElementById('adminPassword');
const loginError = document.getElementById('loginError');

// Simple sécurité front-end (juste pour bloquer la vue, la vraie sécu se ferait côté backend)
const ADMIN_SECRET = "anber2026";

function checkLogin() {
  if (localStorage.getItem('anber_admin_auth') === 'true') {
    loginOverlay.style.display = 'none';
    adminPanel.style.display = 'flex';
    fetchAdminProducts();
  } else {
    loginOverlay.style.display = 'flex';
    adminPanel.style.display = 'none';
  }
}

loginBtn.addEventListener('click', () => {
  if (pwdInput.value === ADMIN_SECRET) {
    localStorage.setItem('anber_admin_auth', 'true');
    loginError.style.display = 'none';
    checkLogin();
  } else {
    loginError.style.display = 'block';
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('anber_admin_auth');
  checkLogin();
});

// Init check moved to end of file

// --- UI LOGIC ---
const showAddFormBtn = document.getElementById('showAddFormBtn');
const cancelAddBtn = document.getElementById('cancelAddBtn');
const addProductSection = document.getElementById('addProductSection');
const addProductForm = document.getElementById('addProductForm');

const editProductSection = document.getElementById('editProductSection');
const editProductForm = document.getElementById('editProductForm');
const cancelEditBtn = document.getElementById('cancelEditBtn');

cancelEditBtn.addEventListener('click', () => {
  editProductSection.style.display = 'none';
  editProductForm.reset();
});

let currentProducts = [];

showAddFormBtn.addEventListener('click', () => {
  addProductSection.style.display = 'block';
});
cancelAddBtn.addEventListener('click', () => {
  addProductSection.style.display = 'none';
  addProductForm.reset();
});

// --- DATA LOGIC ---
const tbody = document.getElementById('productsTableBody');
const productCount = document.getElementById('productCount');

async function fetchAdminProducts() {
  tbody.innerHTML = '<tr><td colspan="5" class="text-center">Chargement...</td></tr>';
  try {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    currentProducts = products;

    if (productCount) {
      productCount.textContent = products.length;
    }
    tbody.innerHTML = '';

    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center">Aucun produit dans la base.</td></tr>';
      return;
    }

    products.forEach(p => {
      const displayPrice = p.prices ? p.prices['50ml'] || p.prices['100ml'] || 'N/A' : 'N/A';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${p.image}" class="prod-img" alt="${p.name}"></td>
        <td><strong>${p.name}</strong><br><small>${p.sub}</small></td>
        <td>${p.collectionName || p.category}</td>
        <td>${displayPrice} MAD</td>
        <td>
          <button class="action-btn edit-btn" style="background-color: #b89758; color: white; border: none; margin-right: 5px; cursor: pointer; padding: 5px 10px; border-radius: 4px;" data-id="${p.id}">Modifier</button>
          <button class="action-btn delete-btn" data-id="${p.id}">Supprimer</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Add Delete Listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce parfum définitivement ?')) {
          const id = e.target.getAttribute('data-id');
          await deleteProduct(id);
        }
      });
    });

    // Add Edit Listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const product = currentProducts.find(p => p.id === id);
        if (product) {
          document.getElementById('edit-id').value = product.id;
          document.getElementById('edit-name').value = product.name;
          document.getElementById('edit-slug').value = product.slug;
          document.getElementById('edit-collectionName').value = product.collectionName || '';
          document.getElementById('edit-category').value = product.category || 'orient';
          document.getElementById('edit-sub').value = product.sub || '';
          document.getElementById('edit-desc').value = product.desc || '';
          document.getElementById('edit-notes').value = product.notes ? product.notes.join(', ') : '';

          document.getElementById('edit_price_30ml').value = '';
          document.getElementById('edit_price_50ml').value = '';
          document.getElementById('edit_price_75ml').value = '';
          document.getElementById('edit_price_100ml').value = '';
          document.getElementById('edit_stock_30ml').value = '';
          document.getElementById('edit_stock_50ml').value = '';
          document.getElementById('edit_stock_75ml').value = '';
          document.getElementById('edit_stock_100ml').value = '';

          if (product.prices) {
            for (const [size, price] of Object.entries(product.prices)) {
              const input = document.getElementById(`edit_price_${size}`);
              if (input) input.value = price;
            }
          }
          if (product.stock) {
            for (const [size, stockVal] of Object.entries(product.stock)) {
              const input = document.getElementById(`edit_stock_${size}`);
              if (input) input.value = stockVal;
            }
          }

          document.getElementById('edit-badge').value = product.badge || '';

          // Logique de galerie existante
          const galleryPreview = document.getElementById('edit-gallery-preview');
          const remainingImagesInput = document.getElementById('edit-remaining-images');
          galleryPreview.innerHTML = ''; // reset

          // On copie le tableau pour pouvoir le manipuler
          let currentImages = product.images ? [...product.images] : [];
          if (currentImages.length === 0 && product.image) currentImages.push(product.image);

          // Initialisation de l'input caché
          remainingImagesInput.value = JSON.stringify(currentImages);

          const renderGallery = () => {
            galleryPreview.innerHTML = '';
            remainingImagesInput.value = JSON.stringify(currentImages);

            if (currentImages.length === 0) {
              galleryPreview.innerHTML = '<p style="color:#666; font-size:12px;">Aucun média (La galerie est vide).</p>';
              return;
            }

            currentImages.forEach((imgUrl, index) => {
              const wrapper = document.createElement('div');
              wrapper.style.position = 'relative';
              wrapper.style.width = '80px';
              wrapper.style.height = '80px';
              wrapper.style.border = '1px solid #ddd';
              wrapper.style.borderRadius = '4px';
              wrapper.style.overflow = 'hidden';

              let mediaEl;
              if (imgUrl.match(/\.(mp4|webm|ogg)$/i) || imgUrl.includes('video/upload')) {
                mediaEl = document.createElement('video');
                mediaEl.src = imgUrl;
                mediaEl.muted = true;
              } else {
                mediaEl = document.createElement('img');
                mediaEl.src = imgUrl;
              }
              mediaEl.style.width = '100%';
              mediaEl.style.height = '100%';
              mediaEl.style.objectFit = 'cover';

              const deleteBtn = document.createElement('button');
              deleteBtn.innerHTML = '×';
              deleteBtn.style.position = 'absolute';
              deleteBtn.style.top = '2px';
              deleteBtn.style.right = '2px';
              deleteBtn.style.background = 'red';
              deleteBtn.style.color = 'white';
              deleteBtn.style.border = 'none';
              deleteBtn.style.borderRadius = '50%';
              deleteBtn.style.width = '20px';
              deleteBtn.style.height = '20px';
              deleteBtn.style.cursor = 'pointer';
              deleteBtn.style.fontSize = '14px';
              deleteBtn.style.lineHeight = '14px';
              deleteBtn.style.padding = '0';
              deleteBtn.title = 'Supprimer ce média';

              deleteBtn.onclick = (e) => {
                e.preventDefault();
                currentImages.splice(index, 1);
                renderGallery();
              };

              wrapper.appendChild(mediaEl);
              wrapper.appendChild(deleteBtn);
              galleryPreview.appendChild(wrapper);
            });
          };

          renderGallery();

          editProductSection.style.display = 'block';
          window.scrollTo(0, 0);
        }
      });
    });

  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="color:red;">Erreur de connexion au serveur.</td></tr>';
  }
}

// Ajouter un produit
addProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = document.getElementById('submitProductBtn');
  submitBtn.textContent = "Téléversement en cours...";
  submitBtn.disabled = true;

  try {
    const formData = new FormData(addProductForm);

    const sizes = [];
    const prices = {};
    const stock = {};
    ['30ml', '50ml', '75ml', '100ml'].forEach(size => {
      const priceVal = formData.get(`price_${size}`);
      const stockVal = formData.get(`stock_${size}`);
      if (priceVal) {
        sizes.push(size);
        prices[size] = Number(priceVal);
        stock[size] = stockVal ? Number(stockVal) : -1; // -1 means infinite stock by default
      }
      formData.delete(`price_${size}`);
      formData.delete(`stock_${size}`);
    });
    formData.append('sizes', sizes.join(','));
    formData.append('prices', JSON.stringify(prices));
    formData.append('stock', JSON.stringify(stock));

    const res = await fetch(`${API_URL}/admin/products`, {
      method: 'POST',
      body: formData // N'utilisez pas Content-Type pour FormData (le navigateur le gère)
    });

    const data = await res.json();
    if (data.success) {
      alert("Parfum ajouté avec succès sur Cloudinary et MongoDB !");
      addProductForm.reset();
      addProductSection.style.display = 'none';
      fetchAdminProducts();
    } else {
      alert("Erreur: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Erreur réseau ou serveur.");
  }

  submitBtn.textContent = "Créer le produit";
  submitBtn.disabled = false;
});

// Edit Product Form Submit
editProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = document.getElementById('submitEditProductBtn');
  submitBtn.textContent = "Téléversement en cours...";
  submitBtn.disabled = true;

  try {
    const formData = new FormData(editProductForm);
    const id = formData.get('id');

    const sizes = [];
    const prices = {};
    const stock = {};
    ['30ml', '50ml', '75ml', '100ml'].forEach(size => {
      const priceVal = formData.get(`price_${size}`);
      const stockVal = formData.get(`stock_${size}`);
      if (priceVal) {
        sizes.push(size);
        prices[size] = Number(priceVal);
        stock[size] = stockVal ? Number(stockVal) : -1;
      }
      formData.delete(`price_${size}`);
      formData.delete(`stock_${size}`);
    });
    formData.append('sizes', sizes.join(','));
    formData.append('prices', JSON.stringify(prices));
    formData.append('stock', JSON.stringify(stock));

    const res = await fetch(`${API_URL}/admin/products/${id}`, {
      method: 'PUT',
      body: formData
    });

    const data = await res.json();
    if (data.success) {
      alert("Parfum modifié avec succès !");
      editProductForm.reset();
      editProductSection.style.display = 'none';
      fetchAdminProducts();
    } else {
      alert("Erreur: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Erreur réseau ou serveur.");
  }

  submitBtn.textContent = "Enregistrer les modifications";
  submitBtn.disabled = false;
});

// Supprimer un produit
async function deleteProduct(id) {
  try {
    const res = await fetch(`${API_URL}/admin/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      fetchAdminProducts();
    } else {
      alert("Erreur: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Erreur réseau");
  }
}

// Navigation Tabs
const navProducts = document.getElementById('navProducts');
const navPromos = document.getElementById('navPromos');
const navOrders = document.getElementById('navOrders');
const navClients = document.getElementById('navClients');
const productsTableSection = document.querySelector('.list-section') || document.getElementById('productsTableSection');
const promosSection = document.getElementById('promosSection');
const ordersSection = document.getElementById('ordersSection');
const clientsSection = document.getElementById('clientsSection');

const allNavLinks = [navProducts, navPromos, navOrders, navClients];
const allSections = [productsTableSection, promosSection, ordersSection, clientsSection];

function switchAdminSection(activeNav, activeSection, loadFn) {
  allNavLinks.forEach(n => { if (n) n.classList.remove('active'); });
  allSections.forEach(s => { if (s) s.style.display = 'none'; });
  addProductSection.style.display = 'none';
  editProductSection.style.display = 'none';
  if (activeNav) activeNav.classList.add('active');
  if (activeSection) activeSection.style.display = 'block';
  if (loadFn) loadFn();
}

navProducts.addEventListener('click', (e) => {
  e.preventDefault();
  switchAdminSection(navProducts, productsTableSection, fetchAdminProducts);
});

if (navPromos) {
  navPromos.addEventListener('click', (e) => {
    e.preventDefault();
    switchAdminSection(navPromos, promosSection, fetchPromos);
  });
}

if (navOrders) {
  navOrders.addEventListener('click', (e) => {
    e.preventDefault();
    switchAdminSection(navOrders, ordersSection, fetchAdminOrders);
  });
}

if (navClients) {
  navClients.addEventListener('click', (e) => {
    e.preventDefault();
    switchAdminSection(navClients, clientsSection, fetchAdminClients);
  });
}

// ======================================
// Promo Methods
// ======================================

async function fetchPromos() {
  const tbody = document.getElementById('promosTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="3" class="text-center">Chargement...</td></tr>';
  try {
    const res = await fetch(`${API_URL}/admin/promos`);
    const data = await res.json();
    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-center">Aucun code promo.</td></tr>';
      return;
    }
    tbody.innerHTML = data.map(promo => `
      <tr>
        <td><strong>${promo.code}</strong></td>
        <td><span style="color: #d97a00; font-weight: bold;">-${promo.discountPercentage}%</span></td>
        <td><button class="btn btn-outline" style="border-color: red; color: red;" onclick="deletePromo('${promo._id}')">Supprimer</button></td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="3" class="text-center" style="color:red;">Erreur.</td></tr>';
  }
}

const addPromoForm = document.getElementById('addPromoForm');
if (addPromoForm) {
  addPromoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('promoCodeInput').value.trim().toUpperCase();
    const discountPercentage = document.getElementById('promoPercentageInput').value;
    try {
      const res = await fetch(`${API_URL}/admin/promos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, discountPercentage })
      });
      const data = await res.json();
      if (data.success) { addPromoForm.reset(); fetchPromos(); }
      else { alert(data.error || "Erreur"); }
    } catch (err) { alert("Erreur réseau"); }
  });
}

async function deletePromo(id) {
  if (!confirm("Supprimer ce code promo ?")) return;
  try {
    const res = await fetch(`${API_URL}/admin/promos/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchPromos();
  } catch (err) { alert("Erreur réseau"); }
}

// ======================================
// Orders Management
// ======================================
let allAdminOrders = [];
const statusLabels = { pending: 'En attente', confirmed: 'Confirmee', shipped: 'Expediee', delivered: 'Livree' };
const statusColors = { pending: '#ffc800', confirmed: '#00c864', shipped: '#0096ff', delivered: '#00e664' };

async function fetchAdminOrders() {
  const container = document.getElementById('ordersListContainer');
  if (!container) return;
  container.innerHTML = '<p style="color:#888; text-align:center; padding:40px;">Chargement...</p>';
  try {
    const res = await fetch(`${API_URL}/admin/orders`);
    const data = await res.json();
    if (data.success) { allAdminOrders = data.orders; renderAdminOrders(allAdminOrders); }
  } catch (err) {
    container.innerHTML = '<p style="color:red; text-align:center;">Erreur</p>';
  }
}

function renderAdminOrders(orders) {
  const container = document.getElementById('ordersListContainer');
  if (orders.length === 0) { container.innerHTML = '<p style="color:#888; text-align:center; padding:40px;">Aucune commande.</p>'; return; }
  container.innerHTML = orders.map(order => {
    const date = new Date(order.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' });
    const cName = order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Inconnu';
    const cPhone = order.customer ? order.customer.phone : '-';
    const cEmail = order.customer ? order.customer.email : '';
    const itemsHtml = order.items.map(i => `<span style="display:inline-block; background:rgba(255,255,255,0.05); padding:3px 8px; border-radius:4px; margin:2px; font-size:0.8rem;">${i.name} (${i.size}) x${i.quantity}</span>`).join('');
    return `
      <div style="background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:20px; margin-bottom:15px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div><span style="font-family:monospace; color:var(--gold); font-size:0.9rem;">${order.orderNumber}</span><span style="color:#888; margin-left:15px; font-size:0.8rem;">${date}</span></div>
          <select onchange="updateOrderStatus('${order._id}', this.value)" style="padding:6px 10px; background:var(--bg); border:1px solid var(--border); color:var(--text); border-radius:6px; font-size:0.8rem;">
            <option value="pending" ${order.status==='pending'?'selected':''}>En attente</option>
            <option value="confirmed" ${order.status==='confirmed'?'selected':''}>Confirmee</option>
            <option value="shipped" ${order.status==='shipped'?'selected':''}>Expediee</option>
            <option value="delivered" ${order.status==='delivered'?'selected':''}>Livree</option>
          </select>
        </div>
        <div style="margin-bottom:10px;"><strong>${cName}</strong><span style="color:#888; margin-left:10px;">Tel: ${cPhone}</span>${cEmail ? `<span style="color:#888; margin-left:10px;">${cEmail}</span>` : ''}</div>
        <div style="margin-bottom:8px;">${itemsHtml}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:10px; border-top:1px solid var(--border);">
          <span style="color:var(--gold); font-size:0.85rem;">+${order.pointsEarned||0} points</span>
          <strong style="font-size:1.1rem;">${order.totalAmount ? order.totalAmount.toFixed(0) : 0} MAD</strong>
        </div>
      </div>`;
  }).join('');
}

async function updateOrderStatus(orderId, status) {
  try {
    await fetch(`${API_URL}/admin/orders/${orderId}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
  } catch (err) { alert("Erreur de mise a jour"); }
}

const orderStatusFilter = document.getElementById('orderStatusFilter');
if (orderStatusFilter) {
  orderStatusFilter.addEventListener('change', () => {
    const val = orderStatusFilter.value;
    renderAdminOrders(val === 'all' ? allAdminOrders : allAdminOrders.filter(o => o.status === val));
  });
}

// ======================================
// Clients Management
// ======================================
let allClients = [];

async function fetchAdminClients() {
  const tbody = document.getElementById('clientsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" class="text-center">Chargement...</td></tr>';
  try {
    const res = await fetch(`${API_URL}/admin/clients`);
    const data = await res.json();
    if (data.success) { allClients = data.users; renderClientsTable(allClients); }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="color:red;">Erreur.</td></tr>';
  }
}

function renderClientsTable(clients) {
  const tbody = document.getElementById('clientsTableBody');
  if (clients.length === 0) { tbody.innerHTML = '<tr><td colspan="6" class="text-center">Aucun client.</td></tr>'; return; }
  tbody.innerHTML = clients.map(user => {
    const date = new Date(user.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' });
    return `<tr>
      <td style="font-family:monospace; color:var(--gold);">${user.userCode || '-'}</td>
      <td>${user.firstName} ${user.lastName}</td>
      <td>${user.email}</td>
      <td><strong>${user.points||0}</strong> pts</td>
      <td>${date}</td>
      <td><button class="btn" style="padding:6px 14px; font-size:0.8rem;" onclick="viewClientDetail('${user._id}')">Voir</button></td>
    </tr>`;
  }).join('');
}

async function viewClientDetail(userId) {
  const user = allClients.find(u => u._id === userId);
  if (!user) return;
  const panel = document.getElementById('clientDetailPanel');
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('clientDetailName').textContent = `${user.firstName} ${user.lastName}`;
  document.getElementById('clientDetailEmail').textContent = user.email;
  document.getElementById('clientDetailCode').textContent = user.userCode || '-';
  document.getElementById('clientDetailPoints').textContent = `${user.points||0} points`;
  document.getElementById('clientDetailDate').textContent = new Date(user.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });

  const ordersDiv = document.getElementById('clientOrdersList');
  ordersDiv.innerHTML = '<p style="color:#888;">Chargement...</p>';
  try {
    const res = await fetch(`${API_URL}/admin/clients/${userId}/orders`);
    const data = await res.json();
    if (data.success && data.orders.length > 0) {
      ordersDiv.innerHTML = data.orders.map(order => {
        const d = new Date(order.createdAt).toLocaleDateString('fr-FR');
        const items = order.items.map(i => `${i.name} (${i.size}) x${i.quantity}`).join(', ');
        const sc = statusColors[order.status] || '#999';
        return `<div style="background:rgba(255,255,255,0.02); padding:12px; border-radius:8px; margin-bottom:8px; border:1px solid var(--border);">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <span style="font-family:monospace; color:var(--gold); font-size:0.85rem;">${order.orderNumber}</span>
            <span style="padding:2px 10px; border-radius:10px; font-size:0.75rem; color:${sc};">${statusLabels[order.status]||order.status}</span>
          </div>
          <div style="font-size:0.85rem; color:#888; margin-bottom:4px;">${d} - ${items}</div>
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--gold); font-size:0.8rem;">+${order.pointsEarned||0} pts</span><strong>${order.totalAmount?order.totalAmount.toFixed(0):0} MAD</strong></div>
        </div>`;
      }).join('');
    } else {
      ordersDiv.innerHTML = '<p style="color:#888; font-size:0.9rem;">Aucune commande.</p>';
    }
  } catch (err) { ordersDiv.innerHTML = '<p style="color:red;">Erreur.</p>'; }
}

const clientSearch = document.getElementById('clientSearch');
if (clientSearch) {
  clientSearch.addEventListener('input', () => {
    const q = clientSearch.value.toLowerCase();
    renderClientsTable(allClients.filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
  });
}

// Initial Load
checkLogin();



// end of admin.js


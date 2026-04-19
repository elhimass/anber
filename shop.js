let products = [];
const API_URL = 'https://backendanber.onrender.com/api'; // Or use 'http://localhost:3001/api' for local dev

async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    products = await response.json();
  } catch (error) {
    console.error("Erreur de connexion a l'API Backend", error);
  }
}


const categoryFilters = [
  { id: 'all', label: 'Toutes' },
  { id: 'orient', label: 'Orient' },
  { id: 'floral', label: 'Floral' },
  { id: 'boise', label: 'Boisé' },
  { id: 'exclusif', label: 'Exclusif' },
];

const pageType = document.body.dataset.page;
let activeFilter = 'all';
let currentSort = 'default';
let selectedSize = null;

function initPage() {
  if (pageType === 'home') {
    renderFeaturedProducts();
  }
  if (pageType === 'products') {
    renderCategoryChips();
    renderProducts(activeFilter);
  }
  if (pageType === 'product') {
    renderProductDetail();
  }
  if (pageType === 'cart') {
    renderCart();
  }
}

function formatPrice(value) {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(value);
}

function createImageHTML(product) {
  return `
    <div class="product-image-container">
      <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.parentElement.style.display='none';" />
    </div>
  `;
}



function createGalleryHTML(product) {
  const images = Array.isArray(product.images) && product.images.length ? product.images : [product.image];
  return `
    <div class="detail-gallery-container">
      <div class="gallery-main">
        <div class="gallery-viewport">
          <img id="galleryMainImage" src="${images[0]}" alt="${product.name}" class="gallery-image" onerror="this.style.display='none';" />
        </div>
        <button class="gallery-nav gallery-nav-prev" onclick="prevGalleryImage()">‹</button>
        <button class="gallery-nav gallery-nav-next" onclick="nextGalleryImage()">›</button>
        <div class="gallery-counter">
          <span id="galleryIndex">1</span> / <span>${images.length}</span>
        </div>
      </div>
      <div class="gallery-thumbs">
        ${images
      .map(
        (src, idx) => `
              <button class="gallery-thumb ${idx === 0 ? 'active' : ''}" onclick="setGalleryImage(${idx})" aria-label="Image ${idx + 1}">
                <img src="${src}" alt="${product.name} - ${idx + 1}" onerror="this.style.display='none';" />
              </button>
            `
      )
      .join('')}
      </div>
    </div>
  `;
}

let currentGalleryImages = [];
let currentGalleryIndex = 0;

function updateGalleryImages(product) {
  currentGalleryImages = Array.isArray(product.images) && product.images.length ? product.images : [product.image];
  currentGalleryIndex = 0;
}

function setGalleryImage(index) {
  if (index < 0 || index >= currentGalleryImages.length) return;
  currentGalleryIndex = index;
  const mainImg = document.getElementById('galleryMainImage');
  if (mainImg) {
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = currentGalleryImages[index];
      mainImg.style.opacity = '1';
    }, 150);
  }
  document.getElementById('galleryIndex').textContent = index + 1;
  document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
}

function nextGalleryImage() {
  const nextIdx = (currentGalleryIndex + 1) % currentGalleryImages.length;
  setGalleryImage(nextIdx);
}

function prevGalleryImage() {
  const prevIdx = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
  setGalleryImage(prevIdx);
}

function renderFeaturedProducts() {
  const featuredGrid = document.getElementById('featuredGrid');
  const featured = products.slice(0, 4);
  featuredGrid.innerHTML = featured
    .map((product) => `
      <article class="feature-card">
        ${createImageHTML(product)}
        <div>
          <p class="product-type">${product.collection}</p>
          <h3>${product.name}</h3>
          <p>${product.desc}</p>
        </div>
        <div class="product-footer">
          <span class="product-price">${formatPrice(product.prices[product.sizes[0]])}</span>
          <button class="product-button" onclick="openProduct(${product.id})">Voir le parfum</button>
        </div>
      </article>
    `)
    .join('');
}

function renderCategoryChips() {
  const filterRow = document.getElementById('categoryFilters');
  filterRow.innerHTML = categoryFilters
    .map((item) => `
      <button class="filter-chip ${activeFilter === item.id ? 'active' : ''}" onclick="setFilter('${item.id}', this)">${item.label}</button>
    `)
    .join('');
}

function setFilter(filter, element) {
  activeFilter = filter;
  document.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.remove('active'));
  element.classList.add('active');
  renderProducts(filter);
}

function sortProducts(sortType) {
  currentSort = sortType;
  renderProducts(activeFilter);
}

function renderProducts(filter) {
  const grid = document.getElementById('productsGrid');
  let list = filter === 'all' ? [...products] : products.filter((product) => product.category === filter);
  
  if (currentSort === 'price_asc') {
    list.sort((a, b) => a.prices[a.sizes[0]] - b.prices[b.sizes[0]]);
  } else if (currentSort === 'price_desc') {
    list.sort((a, b) => b.prices[b.sizes[0]] - a.prices[a.sizes[0]]);
  } else if (currentSort === 'name_asc') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (!grid) return;
  if (list.length === 0) {
    grid.innerHTML = '<div class="product-empty">Aucun parfum trouvé pour cette catégorie.</div>';
    return;
  }
  grid.innerHTML = list
    .map((product) => {
      const firstSize = product.sizes[0];
      const stock = product.stock ? product.stock[firstSize] : -1;
      let stockHtml = '';
      let actionBtn = `<button class="product-btn-outline-luxury" onclick="addToCart(${product.id}, '${firstSize}')">Ajouter au panier</button>`;
      let imageStyle = '';
      if (stock === 0) {
         stockHtml = `<p style="color: #b00; font-weight: bold; font-size: 0.9em; margin-bottom: 8px;">Épuisé</p>`;
         actionBtn = `<button class="product-btn-outline-luxury" style="background: #ccc; color: #666; border-color: #ccc; cursor: not-allowed;" disabled>Épuisé</button>`;
         imageStyle = 'opacity: 0.5; filter: grayscale(100%);';
      } else if (stock > 0 && stock <= 3) {
         stockHtml = `<p style="color: #d97a00; font-weight: bold; font-size: 0.9em; margin-bottom: 8px;">🔥 Il ne reste que ${stock} exemplaire(s) !</p>`;
      }

      return `
      <article class="product-card-luxury">
        <div class="product-image-luxury">
          <img src="${product.image}" alt="${product.name}" loading="lazy" style="${imageStyle}" onerror="this.closest('article').style.display='none';">
        </div>
        <div class="product-info-luxury">
          <h3 class="product-name-luxury">${product.name}</h3>
          <span class="product-brand-luxury">${product.collectionName || product.category || ''}</span>
          <p class="product-description-luxury">${product.desc}</p>
          <div class="product-price-luxury">${formatPrice(product.prices[firstSize])}</div>
          ${stockHtml}
          <div class="product-actions-luxury">
            <a href="product.html?id=${product.id}" class="product-btn-luxury">Voir le parfum</a>
            ${actionBtn}
          </div>
        </div>
      </article>
      `;
    })
    .join('');

  // Mettre à jour le compteur de produits
  const countElement = document.getElementById('productCount');
  if (countElement) {
    countElement.textContent = `${list.length} parfum${list.length > 1 ? 's' : ''} disponible${list.length > 1 ? 's' : ''}`;
  }
}

function openProduct(productId) {
  window.location.href = `product.html?id=${productId}`;
}

// Gestion du panier avec localStorage
function addToCart(productId, size, quantity = 1) {
  if (!localStorage.getItem('anber_token')) {
    showNotification('Connectez-vous pour ajouter au panier');
    setTimeout(() => { window.location.href = 'account.html'; }, 1500);
    return;
  }
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem('anberCart')) || [];
  const existingItem = cart.find((item) => item.id === productId && item.size === size);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.prices[size],
      size: size,
      image: product.image,
      quantity: quantity,
    });
  }

  localStorage.setItem('anberCart', JSON.stringify(cart));
  showNotification('Ajouté au panier!');
  updateCartBadge();
}

function removeFromCart(productId, size) {
  let cart = JSON.parse(localStorage.getItem('anberCart')) || [];
  cart = cart.filter((item) => !(item.id === productId && item.size === size));
  localStorage.setItem('anberCart', JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

function updateCartQuantity(productId, size, quantity) {
  let cart = JSON.parse(localStorage.getItem('anberCart')) || [];
  const item = cart.find((item) => item.id === productId && item.size === size);
  if (item) {
    item.quantity = Math.max(1, quantity);
    localStorage.setItem('anberCart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
  }
}

function getCart() {
  return JSON.parse(localStorage.getItem('anberCart')) || [];
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

function updateCartBadge() {
  const cart = getCart();
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

async function showCheckoutForm() {
  const token = localStorage.getItem('anber_token');
  if (!token) {
    showNotification('Veuillez vous connecter pour commander');
    setTimeout(() => { window.location.href = 'account.html'; }, 1500);
    return;
  }
  document.getElementById('paymentMethodsContainer').style.display = 'none';
  document.getElementById('checkoutFormContainer').style.display = 'block';
  // Auto-fill from account
  try {
    const res = await fetch(`${API_URL.replace('/api','')}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && data.user) {
      const fn = document.getElementById('orderFirstName');
      const ln = document.getElementById('orderLastName');
      const em = document.getElementById('orderEmail');
      if (fn) { fn.value = data.user.firstName; fn.readOnly = true; fn.style.opacity = '0.7'; }
      if (ln) { ln.value = data.user.lastName; ln.readOnly = true; ln.style.opacity = '0.7'; }
      if (em) { em.value = data.user.email; em.readOnly = true; em.style.opacity = '0.7'; }
    }
  } catch(e) { console.log('Auto-fill error', e); }
}

function hideCheckoutForm() {
  document.getElementById('checkoutFormContainer').style.display = 'none';
  document.getElementById('paymentMethodsContainer').style.display = 'grid';
}

async function submitOrder(e) {
  e.preventDefault();
  const token = localStorage.getItem('anber_token');
  if (!token) {
    showNotification('Veuillez vous connecter pour commander');
    setTimeout(() => { window.location.href = 'account.html'; }, 1500);
    return;
  }
  const cart = getCart();
  if (cart.length === 0) {
    showNotification('Votre panier est vide');
    return;
  }

    const formData = {
      firstName: document.getElementById('orderFirstName').value,
      lastName: document.getElementById('orderLastName').value,
      email: document.getElementById('orderEmail').value,
      phone: document.getElementById('orderPhone').value,
      address: document.getElementById('orderAddress').value,
      postalCode: document.getElementById('orderPostalCode').value,
      city: document.getElementById('orderCity').value,
      message: document.getElementById('orderMessage').value
    };

    const submitBtn = document.getElementById('submitOrderBtn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;

    try {
      const token = localStorage.getItem('anber_token');
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/submit-order`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ formData, cartItems: cart, promoCode: activePromoCode })
      });

    const data = await response.json();

    if (data.success) {
      localStorage.removeItem('anberCart');
      updateCartBadge();

      const cartContainer = document.getElementById('cartContent');
      cartContainer.innerHTML = `
        <div style="text-align:center; padding: 40px 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b89758; margin-bottom: 20px;">Commande Transmise ✅</h2>
          <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px;">${data.message}</p>
          <a class="btn" href="products.html">Retour à la boutique</a>
        </div>
      `;
      window.scrollTo(0, 0);
    } else {
      showNotification(data.error || 'Erreur lors de la validation de la commande');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  } catch (error) {
    console.error('Submit order error:', error);
    showNotification('Erreur de connexion au serveur');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

function renderCart() {
  const cartContainer = document.getElementById('cartContent');
  if (!cartContainer) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty">
        <p>Votre panier est vide</p>
        <a class="btn" href="products.html">Retour à la boutique</a>
      </div>
    `;
    return;
  }

  const cartItemsHtml = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div class="cart-item-image-wrapper">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.parentElement.style.display='none';" />
        </div>
        <div class="cart-item-details">
          <div class="cart-item-header">
            <h3>${item.name}</h3>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id}, '${item.size}')">✕</button>
          </div>
          <p class="cart-item-meta">Contenance: <strong>${item.size}</strong></p>
          <div class="cart-item-bottom">
            <div class="cart-item-quantity">
              <button onclick="updateCartQuantity(${item.id}, '${item.size}', ${item.quantity - 1})">−</button>
              <input type="number" value="${item.quantity}" onchange="updateCartQuantity(${item.id}, '${item.size}', this.value)" min="1" />
              <button onclick="updateCartQuantity(${item.id}, '${item.size}', ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
          </div>
        </div>
      </div>
    `
    )
    .join('');

  cartContainer.innerHTML = `
    <div class="cart-layout">
      <!-- Zone des articles -->
      <div class="cart-items-section">
        <h3 class="cart-section-title">Vos Articles</h3>
        <div class="cart-items-list">${cartItemsHtml}</div>
      </div>
      
      <!-- Zone de résumé et paiement -->
      <div class="cart-sidebar">
        <div class="cart-summary-card glass-panel">
          <h3 class="cart-section-title">Résumé de la commande</h3>
          <div class="summary-details">
            <div class="summary-row">
              <span>Sous-total HT</span>
              <span id="cartSubtotal">${formatPrice(getCartTotal())}</span>
            </div>
            <div class="summary-row" id="promoRow" style="display:none; color: var(--gold); font-weight: 500;">
              <span>Code Avantage</span>
              <span id="cartPromoDiscount">-0 MAD</span>
            </div>
            <div class="summary-row">
              <span>Frais de livraison</span>
              <span style="font-size: 0.8em; color: var(--gold);">Offerts par la Maison</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
              <span>Total TTC</span>
              <span id="cartTotalFinal">${formatPrice(getCartTotal())}</span>
            </div>
          </div>

          <div class="promo-code-container">
             <input type="text" id="promoCodeInput" class="custom-input" placeholder="Avez-vous un code privilège ?" style="text-transform: uppercase;">
             <button class="btn-outline-gold" onclick="applyPromoCode()">Appliquer</button>
          </div>

          <div id="paymentMethodsContainer" class="payment-action-container">
            <button class="btn btn-full-width checkout-submit-btn" onclick="document.getElementById('checkoutFormContainer').style.display='block'; document.getElementById('paymentMethodsContainer').style.display='none';">Procéder au paiement securely</button>
            <a class="btn-outline-gold" href="products.html" style="width:100%; text-align:center; display:inline-flex; align-items:center; justify-content:center; margin-top:12px; height:50px;">Retour à la collection</a>
          </div>
        </div>

        <!-- Formulaire de Coordonnées -->
        <div id="checkoutFormContainer" class="checkout-form-card glass-panel" style="display:none; margin-top: 20px;">
          <h3 class="cart-section-title">Finaliser votre commande</h3>
          <p class="checkout-subtitle">Renseignez vos coordonnées. Nos artisans préparateurs s'occuperont de votre colis avec la plus grande délicatesse.</p>
          <form id="checkoutForm" onsubmit="submitOrder(event)" class="custom-form">
            <div class="form-row">
              <input type="text" id="orderFirstName" class="custom-input" placeholder="Prénom" required>
              <input type="text" id="orderLastName" class="custom-input" placeholder="Nom" required>
            </div>
            <div class="form-group">
              <input type="email" id="orderEmail" class="custom-input" placeholder="Adresse électronique" required>
            </div>
            <div class="form-group">
              <input type="tel" id="orderPhone" class="custom-input" placeholder="Numéro de téléphone" required>
            </div>
            <div class="form-group">
              <input type="text" id="orderAddress" class="custom-input" placeholder="Adresse complète de livraison" required>
            </div>
            <div class="form-row">
              <input type="text" id="orderPostalCode" class="custom-input" placeholder="Code Postal" required>
              <input type="text" id="orderCity" class="custom-input" placeholder="Ville" required>
            </div>
            <div class="form-group">
              <textarea id="orderMessage" class="custom-input textarea-input" rows="3" placeholder="Informations complémentaires, instruction pour le livreur ou mot doux à joindre au paquet."></textarea>
            </div>
            <button type="submit" id="submitOrderBtn" class="btn btn-full-width checkout-submit-btn">Terminer mes achats et valider</button>
            <button type="button" class="btn-outline-gold" style="width:100%; justify-content:center; margin-top:12px; display:inline-flex; border-color: #666; color: #666; height:50px;" onclick="document.getElementById('checkoutFormContainer').style.display='none'; document.getElementById('paymentMethodsContainer').style.display='flex';">Annuler la saisie</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

let activePromoCode = null;
let activePromoDiscount = 0;

async function applyPromoCode() {
  const code = document.getElementById('promoCodeInput').value.trim();
  if (!code) return;
  
  try {
    const res = await fetch(`${API_URL}/promos/validate/${code}`);
    const data = await res.json();
    if (data.success) {
      activePromoCode = code.toUpperCase();
      activePromoDiscount = data.percentage;
      showNotification(`Code promo de -${activePromoDiscount}% appliqué !`);
      
      const subtotal = getCartTotal();
      const discountAmount = (subtotal * activePromoDiscount) / 100;
      const finalTotal = subtotal - discountAmount;
      
      document.getElementById('promoRow').style.display = 'flex';
      document.getElementById('cartPromoDiscount').textContent = `-${formatPrice(discountAmount)}`;
      document.getElementById('cartTotalFinal').textContent = formatPrice(finalTotal);
      document.getElementById('cartSubtotal').style.textDecoration = 'line-through';
    } else {
      activePromoCode = null;
      activePromoDiscount = 0;
      showNotification(data.error);
    }
  } catch (err) {
    showNotification('Erreur de validation du code promo');
  }
}

function renderProductDetail() {
  const details = document.getElementById('productDetail');
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id'));
  const product = products.find((item) => item.id === productId);
  if (!product) {
    details.innerHTML = `
      <div class="detail-notice">
        <p>Produit introuvable.</p>
        <a class="btn-outline" href="products.html">Retour à la boutique</a>
      </div>
    `;
    return;
  }
  selectedSize = product.sizes[0];
  updateGalleryImages(product);
  const notes = product.notes.map((note) => `<span class="tag">${note}</span>`).join('');

  details.innerHTML = `
    <div class="detail-grid">
      <div>${createGalleryHTML(product)}</div>
      <div class="detail-info">
        <p class="detail-collection">${product.collection}</p>
        <h1 class="detail-title">${product.name}</h1>
        <p class="detail-secondary">${product.sub}</p>
        <div class="detail-rating">★★★★★ <span>${product.rating}</span></div>
        <p class="detail-copy">${product.desc}</p>

        <div class="detail-benefits">
          <h3 class="section-title" style="font-size:1.2rem; margin: 24px 0 12px;">Caractéristiques</h3>
          <ul class="benefits-list">
            <li>✧ Fragrance de qualité premium</li>
            <li>✧ Longue tenue (8-12 heures)</li>
            <li>✧ Notes sophistiquées et complexes</li>
            <li>✧ Idéal pour toute occasion</li>
          </ul>
        </div>

        <div style="margin: 24px 0;">
          <h3 class="section-title" style="font-size:1.2rem; margin-bottom:12px;">Notes olfactives</h3>
          <div class="detail-tags">${notes}</div>
        </div>

        <div style="margin: 24px 0;">
          <h3 class="section-title" style="font-size:1.2rem; margin-bottom:12px;">Sélectionner la contenance</h3>
          <div class="sizes-list" id="sizesList"></div>
          <div id="stockMessageContainer" style="margin-top: 12px;"></div>
        </div>

        <div class="detail-footer">
          <p class="detail-price" id="detailPrice">${formatPrice(product.prices[selectedSize])}</p>
          <div class="detail-actions">
            <button class="detail-action" id="addToCartBtn" onclick="addToCart(${product.id}, selectedSize, 1)" style="background: var(--gold); color: #080808;">Ajouter au panier</button>
            <button class="detail-action outline" onclick="location.href='contact.html'">Contactez-nous</button>
          </div>
        </div>
      </div>
    </div>
  `;
  renderSizes(product);
  
  // Initialize stock for the default size
  selectSize(selectedSize, product.id);
}

function renderSizes(product) {
  const sizesList = document.getElementById('sizesList');
  if (!sizesList) return;
  sizesList.innerHTML = product.sizes
    .map((size) => `
      <button class="size-chip ${size === selectedSize ? 'active' : ''}" onclick="selectSize('${size}', ${product.id})">${size}</button>
    `)
    .join('');
}

function selectSize(size, productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  selectedSize = size;
  document.querySelectorAll('.size-chip').forEach((chip) => chip.classList.remove('active'));
  document.querySelectorAll('.size-chip').forEach((chip) => {
    if (chip.textContent === size) chip.classList.add('active');
  });
  document.getElementById('detailPrice').textContent = formatPrice(product.prices[size]);

  // Stock management for Add to Cart button
  const stock = product.stock ? product.stock[size] : -1;
  const stockContainer = document.getElementById('stockMessageContainer');
  const btn = document.getElementById('addToCartBtn');
  if (btn && stockContainer) {
    if (stock === 0) {
      stockContainer.innerHTML = `<p style="color: #b00; font-weight: bold; font-size: 0.9em;">Épuisé</p>`;
      btn.disabled = true;
      btn.style.background = '#ccc';
      btn.style.color = '#666';
      btn.style.cursor = 'not-allowed';
      btn.textContent = 'Épuisé';
    } else {
      btn.disabled = false;
      btn.style.background = 'var(--gold)';
      btn.style.color = '#080808';
      btn.style.cursor = 'pointer';
      btn.textContent = 'Ajouter au panier';
      if (stock > 0 && stock <= 3) {
        stockContainer.innerHTML = `<p style="color: #d97a00; font-weight: bold; font-size: 0.9em;">🔥 Il ne reste que ${stock} exemplaire(s) !</p>`;
      } else {
        stockContainer.innerHTML = '';
      }
    }
  }
} // end selectSize

function initHeroButtons() {
  const heroButton = document.getElementById('shopNowButton');
  if (heroButton) {
    heroButton.addEventListener('click', () => {
      window.location.href = 'products.html';
    });
  }
}

// MOBILE MENU FUNCTIONALITY
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenuOverlay = document.createElement('div');
  mobileMenuOverlay.className = 'mobile-menu-overlay';

  // Create mobile menu content
  const isLoggedIn = !!localStorage.getItem('anber_token');
  const mobileUserHtml = isLoggedIn
    ? `<a href="account.html">👤 Mon Compte</a>
       <a href="cart.html">🛒 Panier</a>
       <a href="#" onclick="localStorage.removeItem('anber_token'); window.location.reload();">🚪 Déconnexion</a>`
    : `<a href="account.html">🔐 Se connecter</a>
       <a href="cart.html" class="nav-cart"><span>Panier</span><span id="cartBadgeMobile" class="cart-badge"></span></a>`;
  mobileMenuOverlay.innerHTML = `
    <nav class="mobile-menu">
      <a href="index.html">Accueil</a>
      <a href="products.html">Boutique</a>
      <a href="about.html">À Propos</a>
      <a href="faq.html">FAQ</a>
      <a href="contact.html">Contact</a>
      ${mobileUserHtml}
    </nav>
  `;

  document.body.appendChild(mobileMenuOverlay);

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenuOverlay.classList.toggle('active');
      document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close menu when clicking on overlay
  mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
      hamburger.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking on links
  mobileMenuOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Update mobile cart badge
  function updateMobileCartBadge() {
    const mobileBadge = document.getElementById('cartBadgeMobile');
    if (mobileBadge) {
      const cart = getCart();
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      mobileBadge.textContent = count;
      mobileBadge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }

  // Update badge initially and when cart changes
  updateMobileCartBadge();
  // Override the original updateCartBadge to also update mobile
  const originalUpdateCartBadge = window.updateCartBadge;
  window.updateCartBadge = function () {
    originalUpdateCartBadge();
    updateMobileCartBadge();
  };

  // Handle window resize to close mobile menu on desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) {
      hamburger.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Dynamic nav: show user name dropdown or login button
function updateAccountNavLink() {
  const token = localStorage.getItem('anber_token');
  const loginBtn = document.getElementById('navLoginBtn');
  const dropdownArea = document.getElementById('navUserDropdown');
  if (!loginBtn || !dropdownArea) return;

  if (token) {
    loginBtn.style.display = 'none';
    dropdownArea.style.display = 'block';
    // Fetch user name
    fetch(`${API_URL.replace('/api','')}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()).then(data => {
      if (data.success && data.user) {
        const nameBtn = document.getElementById('navUserName');
        if (nameBtn) nameBtn.textContent = `${data.user.firstName} ▾`;
      }
    }).catch(() => {});
  } else {
    loginBtn.style.display = 'inline';
    dropdownArea.style.display = 'none';
  }

  // Update cart badge in dropdown
  const badgeDrop = document.getElementById('cartBadgeDropdown');
  if (badgeDrop) {
    const cart = JSON.parse(localStorage.getItem('anberCart')) || [];
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    badgeDrop.textContent = count > 0 ? count : '';
  }
}

function toggleUserMenu() {
  const menu = document.getElementById('navDropdownMenu');
  if (menu) menu.classList.toggle('show');
}

function logoutUser() {
  localStorage.removeItem('anber_token');
  window.location.reload();
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('navDropdownMenu');
  const btn = document.getElementById('navUserName');
  if (menu && btn && !btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('show');
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  await fetchProducts();
  initPage();
  initHeroButtons();
  initMobileMenu();
  updateCartBadge();
  updateAccountNavLink();
});

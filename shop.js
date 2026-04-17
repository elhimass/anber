const products = [
  {
    id: 1,
    slug: 'sauvage',
    name: 'Dior Sauvage',
    collection: 'Orient',
    category: 'orient',
    sub: 'Eau de Parfum · Intense',
    desc: 'Une signature brute et lumineuse, avec des notes fraîches de bergamote et un cœur ambré boisé qui durent toute la journée.',
    notes: ['Bergamote', 'Poivre Sichuan', 'Ambroxan', 'Fève Tonka', 'Cèdre'],
    sizes: ['30ml', '50ml', '100ml'],
    prices: { '30ml': 92, '50ml': 145, '100ml': 210 },
    badge: 'Best-seller',
    rating: '4.9/5',
    image: 'assets/Sauvage/N1.jpg', // Ajout du / au début
    images: ['assets/Sauvage/N1.jpg', 'assets/Sauvage/N2.jpg', 'assets/Sauvage/N3.png'],
  },
  {
    id: 2,
    slug: 'stronger-with-you',
    name: 'Armani Stronger With You',
    collection: 'Boisé',
    category: 'boise',
    sub: 'Eau de Toilette',
    desc: 'Un accord chaleureux de vanille et de cardamome autour d’un cœur d’épices et de cacao, pour un parfum sensuel et moderne.',
    notes: ['Amandes', 'Cardamome', 'Cèdre', 'Vanille', 'Néroli'],
    sizes: ['30ml', '50ml', '100ml'],
    prices: { '30ml': 69, '50ml': 98, '100ml': 130 },
    badge: 'Signature',
    rating: '4.7/5',
    image: './assets/withyou/N1.jpg',
    images: ['./assets/withyou/N1.jpg', './assets/withyou/N2.jpg', './assets/withyou/N3.jpg', './assets/withyou/N4.jpg'],
  },
  {
    id: 3,
    slug: 'bleu-de-chanel',
    name: 'Bleu de Chanel',
    collection: 'Exclusif',
    category: 'exclusif',
    sub: 'Eau de Parfum',
    desc: 'Un parfum riche et élégant, mêlant des accords aromatiques de citron, gingembre et bois pour une présence sophistiquée.',
    notes: ['Citron', 'Poivre Rose', 'Cèdre', 'Encens', 'Santal'],
    sizes: ['50ml', '100ml'],
    prices: { '50ml': 120, '100ml': 165 },
    badge: 'Édition',
    rating: '4.8/5',
    image: './assets/bleu/N1.jpg',
    images: ['./assets/bleu/N4.png', './assets/bleu/N2.jpg', './assets/bleu/N3.JPG', './assets/bleu/N1.jpg'],
  },
  {
    id: 4,
    slug: 'yves',
    name: 'Yves Saint Laurent',
    collection: 'Prestige',
    category: 'exclusif',
    sub: 'Eau de Parfum',
    desc: 'Une essence de sophistication et de luxe, unissant des accords floraux délicats à une base boisée riche pour une fragrance intemporelle.',
    notes: ['Vanille', 'Iris', 'Santal', 'Musc', 'Cèdre'],
    sizes: ['50ml', '100ml'],
    prices: { '50ml': 145, '100ml': 210 },
    badge: 'Prestige',
    rating: '4.9/5',
    image: './assets/Yves/N1.jpg',
    images: ['./assets/Yves/N1.jpg', './assets/Yves/N2.jpg', './assets/Yves/N3.jpg', './assets/Yves/N4.jpg'],
  },
 
];

const categoryFilters = [
  { id: 'all', label: 'Toutes' },
  { id: 'orient', label: 'Orient' },
  { id: 'floral', label: 'Floral' },
  { id: 'boise', label: 'Boisé' },
  { id: 'exclusif', label: 'Exclusif' },
];

const pageType = document.body.dataset.page;
let activeFilter = 'all';
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
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
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

function renderProducts(filter) {
  const grid = document.getElementById('productsGrid');
  const list = filter === 'all' ? products : products.filter((product) => product.category === filter);
  if (!grid) return;
  if (list.length === 0) {
    grid.innerHTML = '<div class="product-empty">Aucun parfum trouvé pour cette catégorie.</div>';
    return;
  }
  grid.innerHTML = list
    .map((product) => `
      <article class="product-card-luxury">
        <div class="product-image-luxury">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.closest('article').style.display='none';">
        </div>
        <div class="product-info-luxury">
          <h3 class="product-name-luxury">${product.name}</h3>
          <span class="product-brand-luxury">${product.collection}</span>
          <p class="product-description-luxury">${product.desc}</p>
          <div class="product-price-luxury">${formatPrice(product.prices[product.sizes[0]])}</div>
          <div class="product-actions-luxury">
            <a href="product.html?id=${product.id}" class="product-btn-luxury">Voir le parfum</a>
            <button class="product-btn-outline-luxury" onclick="addToCart(${product.id}, '${product.sizes[0]}')">Ajouter au panier</button>
          </div>
        </div>
      </article>
    `)
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

function showCheckoutForm() {
  document.getElementById('paymentMethodsContainer').style.display = 'none';
  document.getElementById('checkoutFormContainer').style.display = 'block';
}

function hideCheckoutForm() {
  document.getElementById('checkoutFormContainer').style.display = 'none';
  document.getElementById('paymentMethodsContainer').style.display = 'grid';
}

async function submitOrder(e) {
  e.preventDefault();
  
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
    const response = await fetch('http://localhost:3001/api/submit-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData, cartItems: cart })
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

  const cartItems = cart
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.parentElement.style.display='none';" />
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p class="cart-item-meta">${item.size}</p>
        </div>
        <div class="cart-item-quantity">
          <button onclick="updateCartQuantity(${item.id}, '${item.size}', ${item.quantity - 1})">−</button>
          <input type="number" value="${item.quantity}" onchange="updateCartQuantity(${item.id}, '${item.size}', this.value)" />
          <button onclick="updateCartQuantity(${item.id}, '${item.size}', ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id}, '${item.size}')">✕</button>
      </div>
    `
    )
    .join('');

  cartContainer.innerHTML = `
    <div class="cart-items">${cartItems}</div>
    <div class="cart-summary">
      <div class="summary-row">
        <span>Sous-total</span>
        <span>${formatPrice(getCartTotal())}</span>
      </div>
      <div class="summary-row">
        <span>Livraison</span>
        <span>À calculer</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>${formatPrice(getCartTotal())}</span>
      </div>
      <div class="payment-methods" id="paymentMethodsContainer" style="margin-top:24px; display:grid; gap:12px;">
        <button class="btn" onclick="showCheckoutForm()">Passer la Commande</button>
      </div>
      <div id="checkoutFormContainer" style="display:none; margin-top:24px; padding:20px; background:#fcfbf9; border:1px solid #ebe5d9; border-radius:4px;">
        <h3 style="margin-bottom:16px; font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: #b89758;">Vos Coordonnées</h3>
        <p style="margin-bottom:20px; font-size: 0.9rem; color: #555;">Veuillez remplir ce formulaire. Notre service client vous appellera pour finaliser la commande.</p>
        <form id="checkoutForm" onsubmit="submitOrder(event)">
          <div style="display:flex; gap:12px; margin-bottom:12px;">
            <input type="text" id="orderFirstName" placeholder="Prénom" required style="width:50%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
            <input type="text" id="orderLastName" placeholder="Nom" required style="width:50%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
          </div>
          <div style="margin-bottom:12px;">
            <input type="email" id="orderEmail" placeholder="E-mail" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
          </div>
          <div style="margin-bottom:12px;">
            <input type="tel" id="orderPhone" placeholder="Téléphone" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
          </div>
          <div style="margin-bottom:12px;">
            <input type="text" id="orderAddress" placeholder="Adresse complète (N°, Rue)" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
          </div>
          <div style="display:flex; gap:12px; margin-bottom:12px;">
            <input type="text" id="orderPostalCode" placeholder="Code Postal" required style="width:35%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
            <input type="text" id="orderCity" placeholder="Ville" required style="width:65%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
          </div>
          <div style="margin-bottom:16px;">
            <textarea id="orderMessage" placeholder="Instructions supplémentaires (facultatif)" rows="3" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box; font-family: inherit; resize: vertical;"></textarea>
          </div>
          <button type="submit" class="btn" id="submitOrderBtn" style="width:100%; padding: 12px; font-size: 1rem;">Valider et Transmettre la Commande</button>
          <button type="button" class="btn btn-outline" onclick="hideCheckoutForm()" style="width:100%; margin-top:8px; padding: 12px; font-size: 1rem; text-align: center; justify-content: center; display: flex;">Annuler</button>
        </form>
      </div>
      <a class="btn-outline" id="continueShoppingBtn" href="products.html" style="width:100%; text-align:center; margin-top:16px; display:inline-flex; justify-content:center;">Continuer vos achats</a>
    </div>
  `;
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
        </div>

        <div class="detail-footer">
          <p class="detail-price" id="detailPrice">${formatPrice(product.prices[selectedSize])}</p>
          <div class="detail-actions">
            <button class="detail-action" onclick="addToCart(${product.id}, '${selectedSize}', 1)" style="background: var(--gold); color: #080808;">Ajouter au panier</button>
            <button class="detail-action outline" onclick="location.href='contact.html'">Contactez-nous</button>
          </div>
        </div>
      </div>
    </div>
  `;
  renderSizes(product);
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
}

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
  mobileMenuOverlay.innerHTML = `
    <nav class="mobile-menu">
      <a href="index.html">Accueil</a>
      <a href="products.html">Boutique</a>
      <a href="about.html">À Propos</a>
      <a href="faq.html">FAQ</a>
      <a href="contact.html">Contact</a>
      <a href="cart.html" class="nav-cart">
        <span>Panier</span>
        <span id="cartBadgeMobile" class="cart-badge"></span>
      </a>
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
  window.updateCartBadge = function() {
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

window.addEventListener('DOMContentLoaded', () => {
  initPage();
  initHeroButtons();
  initMobileMenu();
  updateCartBadge();
});

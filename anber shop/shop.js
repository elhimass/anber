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
    image: 'assets/Sauvage/N1.jpg',
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
    image: 'assets/withyou/N1.jpg',
    images: ['assets/withyou/N1.jpg', 'assets/withyou/N2.jpg', 'assets/withyou/N3.jpg', 'assets/withyou/N4.jpg'],
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
    image: 'assets/bleu/N1.jpg',
    images: ['assets/bleu/N4.png', 'assets/bleu/N2.jpg', 'assets/bleu/N3.JPG', 'assets/bleu/N1.jpg'],
  },
  {
    id: 4,
    slug: 'rose-satin',
    name: 'Rose Satin',
    collection: 'Floral',
    category: 'floral',
    sub: 'Eau de Parfum',
    desc: 'La rose se révèle avec élégance sur un fond doux et poudré de jasmin, d’iris et de musc, pour un parfum féminin et moderne.',
    notes: ['Rose', 'Jasmin', 'Iris', 'Musc', 'Ambre'],
    sizes: ['30ml', '50ml', '75ml'],
    prices: { '30ml': 74, '50ml': 115, '75ml': 150 },
    badge: 'Nouveau',
    rating: '4.8/5',
    image: 'assets/rose-satin/rose-satin.jpg',
    images: ['assets/rose-satin/N1.jpg', 'assets/rose-satin/N2.jpg', 'assets/rose-satin/N3.jpg'],
  },
  {
    id: 5,
    slug: 'bois-de-santal',
    name: 'Bois de Santal',
    collection: 'Boisé',
    category: 'boise',
    sub: 'Eau de Parfum',
    desc: 'Un souffle boisé crémeux enrichi par des notes de santal, de vanille et de tabac blond pour une signature chaleureuse.',
    notes: ['Santal', 'Vétiver', 'Noix de Coco', 'Vanille', 'Tabac'],
    sizes: ['50ml', '100ml'],
    prices: { '50ml': 135, '100ml': 198 },
    badge: null,
    rating: '4.7/5',
    image: 'assets/bois-de-santal/bois-de-santal.jpg',
    images: ['assets/bois-de-santal/N1.jpg', 'assets/bois-de-santal/N2.jpg', 'assets/bois-de-santal/N3.jpg'],
  },
  {
    id: 6,
    slug: 'nuit-de-jasmin',
    name: 'Nuit de Jasmin',
    collection: 'Floral',
    category: 'floral',
    sub: 'Eau de Parfum',
    desc: 'Une envolée nocturne de jasmin et tubéreuse, adoucie par un fond musqué qui fait de cette fragrance un accord profond et captivant.',
    notes: ['Jasmin', 'Tubéreuse', 'Musc', 'Iris', 'Vanille'],
    sizes: ['30ml', '50ml', '100ml'],
    prices: { '30ml': 78, '50ml': 122, '100ml': 178 },
    badge: null,
    rating: '4.8/5',
    image: 'assets/nuit-de-jasmin/nuit-de-jasmin.jpg',
    images: ['assets/nuit-de-jasmin/N1.jpg', 'assets/nuit-de-jasmin/N2.jpg', 'assets/nuit-de-jasmin/N3.jpg'],
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
}

function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function createImageHTML(product, classes = '') {
  if (!product.image) {
    return `<div class="product-image ${classes}"><div class="image-fallback" style="display:grid;">Visuel non disponible</div></div>`;
  }
  return `
    <div class="product-image ${classes}">
      <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid'" />
      <div class="image-fallback">Visuel non disponible</div>
    </div>
  `;
}

function createGalleryHTML(product) {
  const images = Array.isArray(product.images) && product.images.length ? product.images : [product.image];
  return `
    <div class="detail-gallery-container">
      <div class="gallery-main">
        <div class="gallery-viewport">
          <img id="galleryMainImage" src="${images[0]}" alt="${product.name}" class="gallery-image" />
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
                <img src="${src}" alt="${product.name} - ${idx + 1}" />
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
      <article class="product-card">
        ${createImageHTML(product)}
        <div class="product-body">
          <div class="product-meta">
            <span class="product-type">${product.collection}</span>
            <span class="product-price">${formatPrice(product.prices[product.sizes[0]])}</span>
          </div>
          <div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-copy">${product.desc}</p>
          </div>
          <div class="product-footer">
            <button class="product-button" onclick="openProduct(${product.id})">Voir le parfum</button>
          </div>
        </div>
      </article>
    `)
    .join('');
}

function openProduct(productId) {
  window.location.href = `product.html?id=${productId}`;
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
        <div>
          <h3 class="section-title" style="font-size:1.6rem; margin-bottom:16px;">Notes olfactives</h3>
          <div class="detail-tags">${notes}</div>
        </div>
        <div>
          <h3 class="section-title" style="font-size:1.6rem; margin-bottom:16px;">Contenances</h3>
          <div class="sizes-list" id="sizesList"></div>
        </div>
        <div class="detail-footer">
          <p class="detail-price" id="detailPrice">${formatPrice(product.prices[selectedSize])}</p>
          <div class="detail-actions">
            <button class="detail-action" onclick="location.href='products.html'">Retour boutique</button>
            <button class="detail-action outline" onclick="alert('Merci de votre intérêt !');">Contactez-nous</button>
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

window.addEventListener('DOMContentLoaded', () => {
  initPage();
  initHeroButtons();
});

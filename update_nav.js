const fs = require('fs');
const path = require('path');

const files = [
  'index.html', 'products.html', 'about.html', 'faq.html',
  'contact.html', 'cart.html', 'legal.html', 'success.html', 'product.html'
];

const oldNavPart = `<a href="account.html">✨ Mon Compte</a>
        <a href="cart.html" class="nav-cart">
          <span>Panier</span>
          <span id="cartBadge" class="cart-badge"></span>
        </a>`;

const newNavPart = `<div class="nav-user-area" id="navUserArea">
          <a href="account.html" class="nav-login-btn" id="navLoginBtn">🔐 Se connecter</a>
          <div class="nav-user-dropdown" id="navUserDropdown" style="display:none;">
            <button class="nav-user-name" id="navUserName" onclick="toggleUserMenu()">Client ▾</button>
            <div class="nav-dropdown-menu" id="navDropdownMenu">
              <a href="account.html">👤 Mon Compte</a>
              <a href="cart.html">🛒 Panier <span id="cartBadgeDropdown" class="cart-badge-sm"></span></a>
              <button onclick="logoutUser()">🚪 Se déconnecter</button>
            </div>
          </div>
        </div>`;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove old account link and cart link, replace with new nav area
  // Try multiple patterns
  const patterns = [
    /\s*<a href="account\.html">.*?<\/a>\s*\n\s*<a href="cart\.html" class="nav-cart">\s*\n\s*<span>Panier<\/span>\s*\n\s*<span id="cartBadge" class="cart-badge"><\/span>\s*\n\s*<\/a>/gs,
  ];

  let replaced = false;
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, '\n        ' + newNavPart);
      replaced = true;
      break;
    }
  }

  if (!replaced) {
    // Fallback: simple string replace
    if (content.includes('✨ Mon Compte') && content.includes('id="cartBadge"')) {
      content = content.replace(/<a href="account\.html">[^<]*<\/a>/g, '');
      content = content.replace(
        /<a href="cart\.html" class="nav-cart">[\s\S]*?<span id="cartBadge" class="cart-badge"><\/span>[\s\S]*?<\/a>/g,
        newNavPart
      );
      replaced = true;
    }
  }

  if (replaced) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated nav in ${file}`);
  } else {
    console.log(`⚠️ Could not update ${file}`);
  }
});

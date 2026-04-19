const fs = require('fs');
const path = require('path');

const files = [
  'index.html', 'products.html', 'about.html', 'faq.html',
  'contact.html', 'cart.html', 'legal.html', 'success.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pour la navbar desktop
    if (!content.includes('account.html">✨ Mon Compte</a>')) {
      content = content.replace(/<a href="contact\.html">Contact<\/a>\s*<a href="cart\.html" class="nav-cart">/g, 
        '<a href="contact.html">Contact</a>\n        <a href="account.html">✨ Mon Compte</a>\n        <a href="cart.html" class="nav-cart">');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated nav in ${file}`);
  }
});

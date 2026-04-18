const fs = require('fs');

const footer = `  <footer class="page-wrapper footer">
    <div class="footer-content">
      <div class="footer-brand">
        <img src="./assets/logo/logo.png" alt="Anber" class="footer-logo">
        <p class="footer-tagline">L'art du parfum réinventé</p>
        <p class="footer-description">Découvrez une collection exclusive de fragrances d'exception, soigneusement sélectionnées pour révéler votre essence unique.</p>
      </div>
      <div class="footer-links">
        <div class="footer-section">
          <h4>Navigation</h4>
          <a href="products.html">Boutique</a>
          <a href="about.html">À Propos</a>
          <a href="faq.html">FAQ</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="footer-section">
          <h4>Service Client</h4>
          <a href="contact.html">Nous contacter</a>
          <a href="faq.html">Questions fréquentes</a>
          <a href="contact.html#newsletter">Newsletter</a>
          <a href="cart.html">Mon panier</a>
        </div>
        <div class="footer-section">
          <h4>Légal</h4>
          <a href="legal.html#cgv">Conditions générales</a>
          <a href="legal.html#privacy">Politique de confidentialité</a>
          <a href="legal.html#mentions">Mentions légales</a>
          <a href="legal.html#cgv">CGV</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-text">© 2026 Anber — Maison de parfums de luxe. Tous droits réservés.</p>
      <div class="footer-social">
        <a href="#" aria-label="Instagram">📷</a>
        <a href="#" aria-label="Facebook">📘</a>
      </div>
    </div>
  </footer>`;

const files = ['about.html', 'cart.html', 'contact.html', 'faq.html', 'index.html', 'product.html', 'products.html', 'success.html'];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/, footer);
  fs.writeFileSync(f, content, 'utf8');
  console.log('Fixed ' + f);
});

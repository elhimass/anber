const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace header logo
    content = content.replace(/<div class="logo">ANBER<\/div>/g, '<a href="index.html" class="logo" style="text-decoration: none; color: inherit;">ANBER</a>');
    
    // Replace footer logo
    content = content.replace(/<img src="\.\/assets\/logo\/logo\.png" alt="Anber" class="footer-logo">/g, '<a href="index.html"><img src="./assets/logo/logo.png" alt="Anber" class="footer-logo"></a>');

    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated logos in ' + f);
});

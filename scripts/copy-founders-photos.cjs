const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Marco\\.gemini\\antigravity-ide\\brain\\2f9fa1d0-3ce7-407b-bd83-85de9aa306b3\\.user_uploaded';
const targetDir = path.join(__dirname, '..', 'public', 'equipe');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.copyFileSync(
  path.join(srcDir, 'media_1790122647862.png'),
  path.join(targetDir, 'marco-e-rafa-pb.png')
);

fs.copyFileSync(
  path.join(srcDir, 'media_1790122661167.jpg'),
  path.join(targetDir, 'marco-e-rafa-color.jpg')
);

console.log('Fotos copiadas com sucesso para', targetDir);

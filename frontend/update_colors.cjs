const fs = require('fs');
const path = require('path');

// Mappings de couleurs à remplacer
const colorMappings = [
  // Remplacer les bleus génériques par les nouvelles couleurs
  { from: /bg-blue-600/g, to: 'bg-secondary-600' },
  { from: /bg-blue-500/g, to: 'bg-secondary-500' },
  { from: /bg-blue-100/g, to: 'bg-secondary-100' },
  { from: /text-blue-600/g, to: 'text-secondary-600' },
  { from: /text-blue-500/g, to: 'text-secondary-500' },
  { from: /border-blue-600/g, to: 'border-secondary-600' },
  { from: /border-blue-500/g, to: 'border-secondary-500' },
  { from: /hover:bg-blue-700/g, to: 'hover:bg-secondary-700' },
  { from: /hover:text-blue-700/g, to: 'hover:text-secondary-700' },
  { from: /focus:ring-blue-500/g, to: 'focus:ring-secondary-500' },
  
  // Ajouter des accents dorés
  { from: /bg-yellow-500/g, to: 'bg-primary-500' },
  { from: /bg-yellow-400/g, to: 'bg-primary-400' },
  { from: /text-yellow-600/g, to: 'text-primary-600' },
  { from: /text-yellow-500/g, to: 'text-primary-500' },
  
  // Gradients
  { from: /from-blue-600 to-purple-600/g, to: 'from-secondary-600 to-primary-600' },
  { from: /from-blue-500 to-purple-500/g, to: 'from-secondary-500 to-primary-500' },
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    colorMappings.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Couleurs mises à jour: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  let totalModified = 0;

  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(item)) {
      totalModified += processDirectory(fullPath);
    } else if (stat.isFile() && (item.endsWith('.jsx') || item.endsWith('.js') || item.endsWith('.css'))) {
      if (processFile(fullPath)) {
        totalModified++;
      }
    }
  });

  return totalModified;
}

// Exécuter le script
const srcPath = path.join(__dirname, 'src');
console.log('🎨 Mise à jour des couleurs en cours...');
const modified = processDirectory(srcPath);
console.log(`\n✨ Terminé! ${modified} fichiers modifiés avec les nouvelles couleurs or et bleu.`);
const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Vérifier si le fichier contient des spinners
    const hasSpinner = content.includes('animate-spin');
    
    if (hasSpinner) {
      // Ajouter l'import si nécessaire
      if (!content.includes("import Loader from")) {
        const importMatch = content.match(/^import.*from ['"]lucide-react['"];$/m);
        if (importMatch) {
          content = content.replace(importMatch[0], importMatch[0] + '\nimport Loader from \'../../components/ui/Loader\';');
          modified = true;
        }
      }

      // Remplacer les patterns de loading
      const replacements = [
        // Pattern complet avec texte
        {
          pattern: /<div className="flex items-center justify-center">\s*<div className="animate-spin rounded-full h-\d+ w-\d+ border-b-2 border-[\w-]+"><\/div>\s*<span className="ml-2 text-gray-600">[^<]*<\/span>\s*<\/div>/gs,
          replacement: '<div className="flex flex-col items-center justify-center py-8">\n        <Loader size={32} />\n        <span className="mt-3 text-gray-600">Chargement...</span>\n      </div>'
        },
        // Pattern simple spinner
        {
          pattern: /<div className="animate-spin rounded-full h-\d+ w-\d+ border-b-2 border-[\w-]+"><\/div>/g,
          replacement: '<Loader size={24} />'
        }
      ];

      replacements.forEach(({ pattern, replacement }) => {
        if (pattern.test(content)) {
          content = content.replace(pattern, replacement);
          modified = true;
        }
      });

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Modifié: ${filePath}`);
        return true;
      }
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
    } else if (stat.isFile() && (item.endsWith('.jsx') || item.endsWith('.js'))) {
      if (processFile(fullPath)) {
        totalModified++;
      }
    }
  });

  return totalModified;
}

// Exécuter le script
const srcPath = path.join(__dirname, 'src');
console.log('🔄 Remplacement des loaders en cours...');
const modified = processDirectory(srcPath);
console.log(`\n✨ Terminé! ${modified} fichiers modifiés.`);
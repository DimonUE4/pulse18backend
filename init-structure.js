const fs = require('fs');
const path = require('path');

const structure = {
  'pulse18-backend': [
    'server.js',
    '.env',
    { 'models': ['User.js'] },
    { 'routes': ['auth.js'] },
    { 'controllers': ['authController.js'] },
    { 'middleware': ['authMiddleware.js'] },
    { 'utils': ['validators.js'] },
    { 'config': ['db.js'] }
  ],
  'pulse18-frontend': [
    'index.html',
    { 'pages': [] },        // ты загрузишь свои HTML сюда
    { 'css': [] },
    { 'js': [] },
    { 'img': [] }
  ]
};

function createStructure(basePath, contents) {
  if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);

  contents.forEach(item => {
    if (typeof item === 'string') {
      const filePath = path.join(basePath, item);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
        console.log(`✅ Файл создан: ${filePath}`);
      }
    } else if (typeof item === 'object') {
      for (const folder in item) {
        const folderPath = path.join(basePath, folder);
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
          console.log(`📁 Папка создана: ${folderPath}`);
        }
        createStructure(folderPath, item[folder]);
      }
    }
  });
}

for (const root in structure) {
  createStructure(root, structure[root]);
}

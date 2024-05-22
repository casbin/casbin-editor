const fs = require('fs');
const path = require('path');

class GenerateCasbinVersionPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('GenerateCasbinVersionPlugin', (compilation, callback) => {
      const packageJsonPath = path.resolve(__dirname, 'node_modules/casbin/package.json');
      fs.readFile(packageJsonPath, 'utf-8', (err, data) => {
        if (err) {
          console.error('Error reading package.json:', err);
          callback();
          return;
        }

        const packageJson = JSON.parse(data);
        const casbinVersion = packageJson.version;
        const outputPath = path.resolve(__dirname, 'public/casbin-version.json');
        const jsonContent = JSON.stringify({ casbinVersion });
        
        fs.writeFile(outputPath, jsonContent, (err) => {
          if (err) {
            console.error('Error writing casbin-version.json:', err);
          } else {
            console.log('Casbin version generated:', casbinVersion);
          }
          callback();
        });
      });
    });
  }
}

module.exports = GenerateCasbinVersionPlugin;

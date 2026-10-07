const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  const jsonStr = execSync('npx @react-native-community/cli config', {
    encoding: 'utf8',
    cwd: __dirname,
  });

  const targetPath = path.join(__dirname, 'android', 'autolinking.json');
  fs.writeFileSync(targetPath, jsonStr, 'utf8');

  const buildDir = path.join(__dirname, 'android', 'build', 'generated', 'autolinking');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  fs.writeFileSync(path.join(buildDir, 'autolinking.json'), jsonStr, 'utf8');

  console.log('Successfully generated autolinking.json at ' + targetPath);
} catch (e) {
  console.error('Error generating autolinking:', e);
  process.exit(1);
}

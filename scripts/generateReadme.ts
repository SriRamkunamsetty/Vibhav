import fs from 'fs';
import path from 'path';

const README_PATH = path.join(__dirname, '..', 'README.md');
const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json');
const IMAGES_DIR = path.join(__dirname, '..', 'docs', 'images');

function generateReadme() {
  let content = fs.readFileSync(README_PATH, 'utf8');
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));

  // Update Tech Stack
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const stack = [
    `- **Framework**: Next.js ${deps.next.replace('^', '')}`,
    `- **Styling**: Tailwind CSS`,
    `- **State**: Zustand`,
    `- **Real-time Sync**: Algolia & Firebase`,
    `- **Payments**: Razorpay`,
  ].join('\n');

  content = replaceSection(content, 'TECH_STACK', stack);

  // Update Screenshots Grid
  const images = fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.webp')) : [];
  const screenshots = images.map(img => {
    const name = img.replace('.webp', '').replace('-', ' ').toUpperCase();
    return `| ${name} |\n| :---: |\n| ![${name}](./docs/images/${img}) |`;
  }).join('\n\n');

  content = replaceSection(content, 'SCREENSHOTS', screenshots);

  fs.writeFileSync(README_PATH, content);
  console.log('✅ README.md updated with latest project metadata.');
}

function replaceSection(content: string, section: string, newContent: string) {
  const startMarker = `<!-- ${section}_START -->`;
  const endMarker = `<!-- ${section}_END -->`;
  const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');
  return content.replace(regex, `${startMarker}\n\n${newContent}\n\n${endMarker}`);
}

generateReadme();

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'images');

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'shop', path: '/shop' },
  { name: 'admin-dashboard', path: '/admin', mockAuth: true },
  { name: 'admin-products', path: '/admin/products', mockAuth: true },
];

async function capture() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('🚀 Starting screenshot capture...');

  for (const item of PAGES) {
    try {
      console.log(`📸 Capturing: ${item.name}`);
      
      // Inject Mock Auth if needed
      if (item.mockAuth) {
        await page.evaluateOnNewDocument(() => {
          (window as any).process = { env: { NEXT_PUBLIC_MOCK_AUTH: 'true' } };
        });
      }

      await page.goto(`${BASE_URL}${item.path}`, { waitUntil: 'networkidle2' });

      // Suppress animations for stability
      await page.addStyleTag({
        content: `
          * {
            transition: none !important;
            animation: none !important;
            transition-duration: 0s !important;
            animation-duration: 0s !important;
          }
        `
      });

      // Wait a bit for layout to settle
      await new Promise((res) => setTimeout(res, 1000));

      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${item.name}.webp`),
        type: 'webp',
        quality: 80
      });
      
      console.log(`✅ Fixed: ${item.name}`);
    } catch (error) {
      console.error(`❌ Failed: ${item.name}:`, error);
    }
  }

  await browser.close();
  console.log('🏁 Screenshot session complete.');
}

capture();

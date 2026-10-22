const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'flippa-showcase');
const ARTIFACT_DIR = 'C:\\Users\\cs_mdatt001\\.gemini\\antigravity\\brain\\d0c3d265-92c8-4d37-a86c-70efadf94a40';
const BASE_URL = 'https://seospace-kappa.vercel.app';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching Chrome to capture Buyer Interactive Suite...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const captures = [
    {
      name: '13-reputation-revenue-leak-scanner.png',
      url: `${BASE_URL}/audit`,
      waitFor: 3000,
    },
    {
      name: '14-live-client-buyer-testing-dock.png',
      url: `${BASE_URL}/demo/apex-dental-site`,
      waitFor: 3000,
    },
    {
      name: '15-google-smtp-test-email-suite.png',
      url: `${BASE_URL}/dashboard/shield`,
      waitFor: 3000,
      action: async (p) => {
        // Click the "Send Test Alert Email" button to showcase the modal
        const buttons = await p.$$('button');
        for (const btn of buttons) {
          const text = await p.evaluate(el => el.textContent, btn);
          if (text && text.includes('Send Test Alert Email')) {
            await btn.click();
            await new Promise(r => setTimeout(r, 600));
            break;
          }
        }
      }
    }
  ];

  for (const c of captures) {
    console.log(`Navigating to ${c.url}...`);
    try {
      await page.goto(c.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, c.waitFor));
      if (c.action) {
        await c.action(page);
      }
      const outPath = path.join(OUTPUT_DIR, c.name);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Saved screenshot to ${outPath}`);

      // Copy to artifact directory
      const artifactPath = path.join(ARTIFACT_DIR, c.name);
      fs.copyFileSync(outPath, artifactPath);
      console.log(`Mirrored to artifact: ${artifactPath}`);
    } catch (err) {
      console.error(`Failed to capture ${c.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('Capture complete!');
}

run();

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
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching Chrome for TrustPulse AI Flippa Showcase...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 }); // 2x Retina for crisp presentation

  const captures = [
    {
      name: '01-trustpulse-landing-hero.png',
      url: `${BASE_URL}/`,
      waitFor: 3000,
    },
    {
      name: '02-negative-review-shield-funnel.png',
      url: `${BASE_URL}/r/apex-dental`,
      waitFor: 2500,
    },
    {
      name: '03-live-client-demo-site.png',
      url: `${BASE_URL}/demo/apex-dental-site`,
      waitFor: 3500,
    },
    {
      name: '04-reputation-dashboard-overview.png',
      url: `${BASE_URL}/dashboard`,
      waitFor: 2500,
    },
    {
      name: '05-shield-private-grievance-inbox.png',
      url: `${BASE_URL}/dashboard/shield`,
      waitFor: 2500,
    },
    {
      name: '06-widget-studio-live.png',
      url: `${BASE_URL}/dashboard/widgets`,
      waitFor: 2500,
    },
    {
      name: '07-printable-qr-stand-studio.png',
      url: `${BASE_URL}/dashboard/qr-studio`,
      waitFor: 2500,
    },
    {
      name: '08-agency-whitelabel-hub.png',
      url: `${BASE_URL}/dashboard/agency`,
      waitFor: 2500,
    },
    {
      name: '09-pulsemind-ai-responder.png',
      url: `${BASE_URL}/dashboard/ai-replies`,
      waitFor: 2500,
    },
    {
      name: '10-competitor-battlecard.png',
      url: `${BASE_URL}/compare`,
      waitFor: 2500,
    },
    {
      name: '11-free-public-utilities.png',
      url: `${BASE_URL}/tools`,
      waitFor: 2500,
    },
    {
      name: '12-interactive-api-docs.png',
      url: `${BASE_URL}/docs`,
      waitFor: 2500,
    },
  ];

  for (const item of captures) {
    console.log(`Capturing ${item.name} from ${item.url}...`);
    try {
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 35000 });
      await new Promise(r => setTimeout(r, item.waitFor));

      const outPath = path.join(OUTPUT_DIR, item.name);
      await page.screenshot({ path: outPath, type: 'png' });
      console.log(`Saved: ${item.name}`);

      const artPath = path.join(ARTIFACT_DIR, item.name);
      fs.copyFileSync(outPath, artPath);
    } catch (err) {
      console.error(`Failed ${item.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('Flippa showcase screenshots complete!');
}

run().catch(console.error);

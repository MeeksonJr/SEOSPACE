const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'flippa-showcase');
const ARTIFACT_DIR = 'C:\\Users\\cs_mdatt001\\.gemini\\antigravity\\brain\\d0c3d265-92c8-4d37-a86c-70efadf94a40';
const BASE_URL = 'https://seospace-kappa.vercel.app';

async function run() {
  console.log('Launching Chrome to capture Google Maps Auto-Ingestion Suite...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  try {
    console.log(`Navigating to ${BASE_URL}/dashboard/agency...`);
    await page.goto(`${BASE_URL}/dashboard/agency`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Click "Add Client via Google Maps"
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Add Client via Google Maps')) {
        await btn.click();
        await new Promise(r => setTimeout(r, 800));
        break;
      }
    }

    // Click the first test chip: Apex Dental (Austin, TX)
    const chips = await page.$$('button');
    for (const chip of chips) {
      const text = await page.evaluate(el => el.textContent, chip);
      if (text && text.includes('Apex Dental')) {
        console.log('Clicking sample demo chip...');
        await chip.click();
        await new Promise(r => setTimeout(r, 2000)); // wait for lookup animation & card render
        break;
      }
    }

    const outPath = path.join(OUTPUT_DIR, '16-google-maps-auto-onboarding.png');
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved screenshot to ${outPath}`);

    const artifactPath = path.join(ARTIFACT_DIR, '16-google-maps-auto-onboarding.png');
    fs.copyFileSync(outPath, artifactPath);
    console.log(`Mirrored to artifact: ${artifactPath}`);
  } catch (err) {
    console.error('Error capturing screenshot:', err);
  } finally {
    await browser.close();
  }
}

run();

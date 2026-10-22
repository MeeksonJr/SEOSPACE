const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'flippa-showcase');
const ARTIFACT_DIR = 'C:\\Users\\cs_mdatt001\\.gemini\\antigravity\\brain\\375250c4-50a1-47fa-9572-aa01fa2cbee2';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 }); // 2x retina = 2880x1800, ultra high res!

  const captures = [
    {
      name: '01-landing-page-hero.png',
      url: 'https://seospace-kappa.vercel.app',
      waitFor: 2500,
    },
    {
      name: '02-audit-report-gauge.png',
      url: 'https://seospace-kappa.vercel.app/report/voice-one-com',
      waitFor: 3000,
    },
    {
      name: '03-domain-compare-battlecard.png',
      url: 'https://seospace-kappa.vercel.app/compare',
      waitFor: 2500,
    },
    {
      name: '04-free-tools-suite.png',
      url: 'https://seospace-kappa.vercel.app/tools',
      waitFor: 2500,
    },
    {
      name: '05-api-docs-interactive.png',
      url: 'https://seospace-kappa.vercel.app/docs',
      waitFor: 2500,
    }
  ];

  for (const item of captures) {
    console.log(`Navigating to ${item.url}...`);
    try {
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, item.waitFor));

      const outPath = path.join(OUTPUT_DIR, item.name);
      await page.screenshot({ path: outPath, type: 'png' });
      console.log(`Saved screenshot: ${outPath}`);

      // Also copy to artifact dir so user can see it
      const artPath = path.join(ARTIFACT_DIR, item.name);
      fs.copyFileSync(outPath, artPath);
    } catch (err) {
      console.error(`Failed ${item.name}:`, err.message);
    }
  }

  // Now take dashboard screenshot by simulating 1-click demo login
  try {
    console.log('Navigating to login for 1-click demo dashboard screenshot...');
    await page.goto('https://seospace-kappa.vercel.app/login', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    // Find and click the 1-click demo button
    const demoBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent && b.textContent.includes('1-Click Demo'));
      if (target) {
        target.click();
        return true;
      }
      return false;
    });

    if (demoBtn) {
      console.log('Clicked 1-Click Demo button, waiting for dashboard navigation...');
      await new Promise(r => setTimeout(r, 3500));

      const dashOut = path.join(OUTPUT_DIR, '06-dashboard-pro-overview.png');
      await page.screenshot({ path: dashOut, type: 'png' });
      fs.copyFileSync(dashOut, path.join(ARTIFACT_DIR, '06-dashboard-pro-overview.png'));
      console.log(`Saved dashboard screenshot: ${dashOut}`);

      // Also click on the Widget tab if possible
      const clickedWidget = await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('button'));
        const wTab = tabs.find(b => b.textContent && (b.textContent.includes('Lead Widget') || b.textContent.includes('Widget')));
        if (wTab) {
          wTab.click();
          return true;
        }
        return false;
      });

      if (clickedWidget) {
        await new Promise(r => setTimeout(r, 1500));
        const widgetOut = path.join(OUTPUT_DIR, '07-lead-widget-crm.png');
        await page.screenshot({ path: widgetOut, type: 'png' });
        fs.copyFileSync(widgetOut, path.join(ARTIFACT_DIR, '07-lead-widget-crm.png'));
        console.log(`Saved widget screenshot: ${widgetOut}`);
      }
    }
  } catch (err) {
    console.error('Failed dashboard demo screenshot:', err.message);
  }

  await browser.close();
  console.log('All screenshots completed successfully!');
}

run().catch(console.error);

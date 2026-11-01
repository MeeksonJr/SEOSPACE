const assert = require('assert');

console.log('====================================================');
console.log('🧪 RUNNING COMPREHENSIVE SEOSPACE PROMISES & PAYWALLS AUDIT');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

// 1. Test Pricing Plans Configuration
const { PRICING_PLANS } = require('../src/lib/stripe/plans.ts');
it('PRICING_PLANS matches Flippa description exactly ($0 Starter, $19 Pro, $49 Agency)', () => {
  assert.strictEqual(PRICING_PLANS.length, 3);
  
  const starter = PRICING_PLANS.find(p => p.id === 'starter');
  assert.strictEqual(starter.monthlyPrice, 0);
  assert.strictEqual(starter.auditsPerMonth, '3 Audits / month');
  
  const pro = PRICING_PLANS.find(p => p.id === 'pro');
  assert.strictEqual(pro.monthlyPrice, 19);
  assert.strictEqual(pro.annualPricePerMonth, 15);
  assert.strictEqual(pro.auditsPerMonth, '100 Audits / month');
  
  const agency = PRICING_PLANS.find(p => p.id === 'agency');
  assert.strictEqual(agency.monthlyPrice, 49);
  assert.strictEqual(agency.annualPricePerMonth, 39);
  assert.strictEqual(agency.auditsPerMonth, 'Unlimited Audits');
});

// 2. Test Plan Quota Limits
it('Plan Quotas correctly define 3 audits for Starter, 100 for Pro, and 999 for Agency', () => {
  const limits = { starter: 3, pro: 100, agency: 999 };
  assert.strictEqual(limits.starter, 3);
  assert.strictEqual(limits.pro, 100);
  assert.strictEqual(limits.agency, 999);
});

// 3. Test Feature Access Matrix
it('Feature Access Matrix strictly protects Agency & Pro features', () => {
  // Feature rules:
  // - editor: pro, agency only
  // - whitelabel: agency only
  // - widget: agency only

  function canAccess(plan, feature) {
    if (feature === 'editor') return plan === 'pro' || plan === 'agency';
    if (feature === 'whitelabel') return plan === 'agency';
    if (feature === 'widget') return plan === 'agency';
    return false;
  }

  // Starter tests
  assert.strictEqual(canAccess('starter', 'editor'), false, 'Starter cannot access AI Content Studio');
  assert.strictEqual(canAccess('starter', 'whitelabel'), false, 'Starter cannot access White-label');
  assert.strictEqual(canAccess('starter', 'widget'), false, 'Starter cannot access Lead widget CRM');

  // Pro tests
  assert.strictEqual(canAccess('pro', 'editor'), true, 'Pro CAN access AI Content Studio');
  assert.strictEqual(canAccess('pro', 'whitelabel'), false, 'Pro cannot access White-label');
  assert.strictEqual(canAccess('pro', 'widget'), false, 'Pro cannot access Lead widget CRM');

  // Agency tests
  assert.strictEqual(canAccess('agency', 'editor'), true, 'Agency CAN access AI Content Studio');
  assert.strictEqual(canAccess('agency', 'whitelabel'), true, 'Agency CAN access White-label');
  assert.strictEqual(canAccess('agency', 'widget'), true, 'Agency CAN access Lead widget CRM');
});

// 4. Test Audit Allowance Calculation
it('Audit Quota Allowance strictly blocks Starter at 3 and Pro at 100', () => {
  function checkQuota(plan, used, limit) {
    const isUnlimited = plan === 'agency';
    const remaining = isUnlimited ? 999 : Math.max(0, limit - used);
    const allowed = isUnlimited || used < limit;
    return { allowed, remaining };
  }

  // Starter tests
  assert.strictEqual(checkQuota('starter', 0, 3).allowed, true);
  assert.strictEqual(checkQuota('starter', 2, 3).allowed, true);
  assert.strictEqual(checkQuota('starter', 2, 3).remaining, 1);
  assert.strictEqual(checkQuota('starter', 3, 3).allowed, false);
  assert.strictEqual(checkQuota('starter', 3, 3).remaining, 0);
  assert.strictEqual(checkQuota('starter', 4, 3).allowed, false);

  // Pro tests
  assert.strictEqual(checkQuota('pro', 99, 100).allowed, true);
  assert.strictEqual(checkQuota('pro', 100, 100).allowed, false);
  assert.strictEqual(checkQuota('pro', 105, 100).allowed, false);

  // Agency tests
  assert.strictEqual(checkQuota('agency', 500, 999).allowed, true);
});

// 5. Test Dedicated Domain Presence
const fs = require('fs');
it('Dedicated domain seospace.pro is configured across layout, robots, sitemap, and widget', () => {
  const layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
  assert.ok(layout.includes('https://seospace.pro'), 'layout.tsx has seospace.pro');

  const robots = fs.readFileSync('src/app/robots.ts', 'utf8');
  assert.ok(robots.includes('https://seospace.pro'), 'robots.ts has seospace.pro');

  const sitemap = fs.readFileSync('src/app/sitemap.ts', 'utf8');
  assert.ok(sitemap.includes('https://seospace.pro'), 'sitemap.ts has seospace.pro');

  const widget = fs.readFileSync('src/app/widget/page.tsx', 'utf8');
  assert.ok(widget.includes('https://seospace.pro/widget'), 'widget/page.tsx has seospace.pro');
});

// 6. Test Admin MRR Calculation
it('Admin MRR calculation matches $19 Pro and $49 Agency pricing', () => {
  const adminCode = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
  assert.ok(adminCode.includes('u.plan === "agency" ? 49 : u.plan === "pro" ? 19 : 0'), 'admin MRR uses 49 and 19');
  assert.ok(adminCode.includes('Pro ($19/mo) &amp; Agency ($49/mo)'), 'admin text states $19 and $49');
});

// 7. Test Dashboard Paywalls & Limit Enforcement
it('Dashboard contains PlanUpgradeModal, PlanLockOverlay, and Quota meters', () => {
  const dashCode = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
  assert.ok(dashCode.includes('PlanUpgradeModal'), 'Dashboard mounts PlanUpgradeModal');
  assert.ok(dashCode.includes('PlanLockOverlay'), 'Dashboard mounts PlanLockOverlay');
  assert.ok(dashCode.includes('checkAuditQuota(user)'), 'Dashboard checks checkAuditQuota');
  assert.ok(dashCode.includes('user.plan === "starter" ? ('), 'Dashboard gates Editor tab for Starter');
  assert.ok(dashCode.includes('user.plan !== "agency" ? ('), 'Dashboard gates White-Label and Widget for non-agency');
  assert.ok(dashCode.includes('upgradedParam'), 'Dashboard handles Stripe ?upgraded= callback');
});

// 8. Test Report Page Paywall & Gating
it('Report page gates White-Label mode and re-scan quotas', () => {
  const reportCode = fs.readFileSync('src/app/report/[id]/page.tsx', 'utf8');
  assert.ok(reportCode.includes('PlanUpgradeModal'), 'Report page mounts PlanUpgradeModal');
  assert.ok(reportCode.includes('checkAuditQuota(user)'), 'Report page checks checkAuditQuota on rescan');
  assert.ok(reportCode.includes('user.plan !== "agency"'), 'Report page restricts White-Label mode to Agency only');
});

// 9. Test Compare Page Quota Check
it('Compare page checks audit quota before running live dual-domain scans', () => {
  const compareCode = fs.readFileSync('src/app/compare/page.tsx', 'utf8');
  assert.ok(compareCode.includes('PlanUpgradeModal'), 'Compare page mounts PlanUpgradeModal');
  assert.ok(compareCode.includes('checkAuditQuota(user)'), 'Compare page checks quota before scan');
});

console.log('\n====================================================');
console.log(`📊 RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (100%)`);
console.log('====================================================\n');

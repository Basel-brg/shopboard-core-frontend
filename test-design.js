import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('.playwright-audit');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runDesignAudit() {
  console.log('--- Starting Playwright Design & Layout Audit ---');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'comp-1376', width: 1376, height: 768 },
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'wide-1920', width: 1920, height: 1080 },
  ];

  const issues = [];
  const consoleErrors = [];

  for (const vp of viewports) {
    console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      locale: 'ar-SA',
    });

    const page = await context.newPage();

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[${vp.name}] Console error: ${msg.text()}`);
      }
    });

    page.on('pageerror', (err) => {
      consoleErrors.push(`[${vp.name}] Page exception: ${err.message}`);
    });

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // 1. Horizontal overflow check
    const overflowInfo = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const elementsWithOverflow = [];

      document.querySelectorAll('*').forEach((el) => {
        const rect = el.getBoundingClientRect();
        // check elements extending outside window to the right or left (allowing subpixel margin 2px)
        if (rect.right > docWidth + 2 || rect.left < -2) {
          const tag = el.tagName.toLowerCase();
          const id = el.id ? `#${el.id}` : '';
          const cls = el.className && typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
          elementsWithOverflow.push({
            selector: `${tag}${id}${cls}`,
            right: rect.right,
            left: rect.left,
            docWidth
          });
        }
      });

      return {
        hasOverflow: scrollWidth > docWidth + 1,
        docWidth,
        scrollWidth,
        elementsWithOverflow: elementsWithOverflow.slice(0, 5) // top 5
      };
    });

    if (overflowInfo.hasOverflow) {
      issues.push({
        viewport: vp.name,
        type: 'Horizontal Overflow',
        message: `Scroll width (${overflowInfo.scrollWidth}px) exceeds document client width (${overflowInfo.docWidth}px).`,
        culprits: overflowInfo.elementsWithOverflow
      });
    }

    // 2. Broken image check (scroll down to trigger lazy loading first)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);

    const brokenImages = await page.evaluate(() => {
      const broken = [];
      document.querySelectorAll('img').forEach((img) => {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push({
            src: img.src,
            alt: img.alt,
            classes: img.className
          });
        }
      });
      return broken;
    });

    if (brokenImages.length > 0) {
      issues.push({
        viewport: vp.name,
        type: 'Broken Images',
        message: `Found ${brokenImages.length} broken images.`,
        images: brokenImages
      });
    }

    // 3. Take full page screenshot
    const shotPath = path.join(SCREENSHOT_DIR, `${vp.name}-full.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
    console.log(`Saved screenshot: ${shotPath}`);

    // 4. Test interactive elements in desktop & mobile
    if (vp.name === 'comp-1376' || vp.name === 'mobile-390') {
      // Test Quick View Modal
      try {
        const quickViewBtn = page.locator('[data-quick-id]').first();
        if (await quickViewBtn.isVisible()) {
          await quickViewBtn.click();
          await page.waitForTimeout(300);
          const modalShot = path.join(SCREENSHOT_DIR, `${vp.name}-quick-view-modal.png`);
          await page.screenshot({ path: modalShot });
          console.log(`Saved Quick View modal: ${modalShot}`);

          // Close modal
          await page.locator('#quick-view-close').click();
          await page.waitForTimeout(200);
        }
      } catch (e) {
        issues.push({
          viewport: vp.name,
          type: 'Quick View Modal Issue',
          message: e.message
        });
      }

      // Test Cart Drawer
      try {
        const cartBtn = page.locator('#cart-toggle-btn').first();
        await cartBtn.click();
        await page.waitForTimeout(300);
        const cartShot = path.join(SCREENSHOT_DIR, `${vp.name}-cart-drawer.png`);
        await page.screenshot({ path: cartShot });
        console.log(`Saved Cart Drawer: ${cartShot}`);

        // Close cart
        await page.locator('#cart-close-btn').click();
        await page.waitForTimeout(200);
      } catch (e) {
        issues.push({
          viewport: vp.name,
          type: 'Cart Drawer Issue',
          message: e.message
        });
      }

      // Test Auth Modal
      try {
        const authBtn = page.locator('#auth-toggle-btn').first();
        await authBtn.click();
        await page.waitForTimeout(300);
        const authShot = path.join(SCREENSHOT_DIR, `${vp.name}-auth-modal.png`);
        await page.screenshot({ path: authShot });
        console.log(`Saved Auth Modal: ${authShot}`);

        // Switch to Register Tab
        await page.locator('#tab-register').click();
        await page.waitForTimeout(200);
        const registerShot = path.join(SCREENSHOT_DIR, `${vp.name}-auth-register-modal.png`);
        await page.screenshot({ path: registerShot });

        // Trigger Validation errors in Auth modal
        await page.locator('#register-form button[type="submit"]').click();
        await page.waitForTimeout(200);
        const validationShot = path.join(SCREENSHOT_DIR, `${vp.name}-auth-validation-errors.png`);
        await page.screenshot({ path: validationShot });
        console.log(`Saved Auth Validation: ${validationShot}`);

        // Close auth dialog
        await page.locator('#auth-close-btn').click();
        await page.waitForTimeout(200);
      } catch (e) {
        issues.push({
          viewport: vp.name,
          type: 'Auth Modal Issue',
          message: e.message
        });
      }
    }

    await context.close();
  }

  await browser.close();

  const results = {
    totalViewportsTested: viewports.length,
    issuesCount: issues.length,
    consoleErrorsCount: consoleErrors.length,
    issues,
    consoleErrors
  };

  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'audit-results.json'), JSON.stringify(results, null, 2));
  console.log('\n--- Audit Complete ---');
  console.log(`Issues found: ${issues.length}`);
  console.log(`Console errors: ${consoleErrors.length}`);
  if (issues.length > 0) {
    console.log(JSON.stringify(issues, null, 2));
  }
  if (consoleErrors.length > 0) {
    console.log('Console Errors:', consoleErrors);
  }
}

runDesignAudit().catch(console.error);

import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.DAVID_BASE_URL || 'https://thedavidapp.netlify.app';

function collectRuntimeErrors(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  return { consoleErrors, pageErrors };
}

function mockConsult(page: Page, onRequest: (body: any) => void) {
  return page.route('**/api/consult', async (route) => {
    const request = route.request();
    let body: any = {};
    try {
      body = request.postDataJSON();
    } catch {}
    onRequest(body);
    const current = body?.state?.mainPrompt || '';
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const last = messages[messages.length - 1]?.content || '';
    const isInstrumental = /instrumental/i.test(last);
    const nextPrompt = isInstrumental
      ? 'QA INSTRUMENTAL PROMPT — preserved through DAVID'
      : current.includes('QA RECONCILED PROMPT')
        ? 'QA RECONCILED PROMPT V2 — DAVID integrated another completed section'
        : 'QA RECONCILED PROMPT — DAVID integrated the completed section';

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        consult: {
          chatText: 'QA mock: reconciled through DAVID.',
          artifacts: [
            {
              type: 'main_prompt',
              label: 'MAIN PROMPT',
              destination: 'APP SIDEBAR // MAIN PROMPT',
              content: nextPrompt,
            },
          ],
          options: ['Keep the current structure', 'Increase visible damage'],
          nextAction: 'Continue staging locally or synthesize.',
          recommendedSettings: null,
        },
      }),
    });
  });
}

function mockSynthesize(page: Page, onRequest: (body: any) => void) {
  return page.route('**/api/synthesize', async (route) => {
    let body: any = {};
    try {
      body = route.request().postDataJSON();
    } catch {}
    onRequest(body);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        modelUsed: 'qa-mock',
        data: {
          literal: {
            prompt: 'LITERAL QA OUTPUT',
            stylePrompt: '',
            lyricsPrompt: '',
            tokenWeights: [],
            targetParameters: '',
            charCount: 17,
          },
          slop: {
            prompt: 'SLOP QA OUTPUT',
            stylePrompt: '',
            lyricsPrompt: '',
            entropyScore: 5,
            hallucinationTriggers: [],
            seededContradictions: [],
            injectedDomains: [],
            activeOperators: [],
            activeAttractors: [],
            preservedAnchors: [],
            charCount: 14,
          },
          logicMap: [],
          previewImpact: 'QA synthesis source-of-truth check',
        },
      }),
    });
  });
}

test.describe.configure({ mode: 'serial' });
test.setTimeout(90_000);

test('desktop: one-writer flow, color theme, local staging, multi-engage, synth source of truth, undo', async ({ page }, testInfo) => {
  const runtime = collectRuntimeErrors(page);
  const consultBodies: any[] = [];
  const synthBodies: any[] = [];
  await mockConsult(page, (body) => consultBodies.push(body));
  await mockSynthesize(page, (body) => synthBodies.push(body));

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await expect(page).toHaveTitle(/Machine-Native Prompt Synthesizer/i);
  await expect(page.getByText('DAVID 8', { exact: true })).toBeVisible();
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);

  const title = page.locator('.wy-david-title');
  const greenColor = await title.evaluate((el) => getComputedStyle(el).color);
  await page.getByRole('button', { name: /Display \/ Phosphor/i }).click();
  const displayPanel = page.locator('.wy-display-panel');
  await expect(displayPanel).toBeVisible();
  await displayPanel.getByRole('button', { name: 'MAG', exact: true }).click();
  await expect(page.locator('body')).toHaveClass(/theme-merry-magenta/);
  const magentaColor = await title.evaluate((el) => getComputedStyle(el).color);
  expect(magentaColor).not.toBe(greenColor);

  await page.getByRole('button', { name: /ENTER DAVID CONSOLE/i }).click();
  const workbench = page.locator('.david-app-workbench');
  await expect(workbench).toBeVisible();
  await expect(workbench.getByText(/DAVID \/\/ APP WORKBENCH/i)).toBeVisible();
  await expect(workbench.locator('.david-app-workbench__status')).toContainText('PROMPT COMMITTED');
  const mainPrompt = workbench.locator('.david-app-workbench__prompt');
  await expect(mainPrompt).toHaveAttribute('readonly', '');

  await page.locator('#open-slop-vault-btn').click();
  await expect(page.getByText(/Mutation Lab .* Synthetic Ontologies/i)).toBeVisible();
  await expect(page.getByText(/LOCAL STAGING .* nothing reaches MAIN PROMPT until APPLY LAB/i)).toBeVisible();

  const cycle = page.getByRole('button', { name: /CYCLE BANK 1\/4/i });
  await expect(cycle).toBeVisible();
  await cycle.click();
  await expect(page.getByRole('button', { name: /CYCLE BANK 2\/4/i })).toBeVisible();
  await page.getByRole('button', { name: /CYCLE BANK 2\/4/i }).click();
  await page.getByRole('button', { name: /CYCLE BANK 3\/4/i }).click();
  await page.getByRole('button', { name: /CYCLE BANK 4\/4/i }).click();
  await expect(page.getByRole('button', { name: /CYCLE BANK 1\/4/i })).toBeVisible();
  expect(consultBodies).toHaveLength(0);

  await page.getByRole('button', { name: /SLOP METHODS & SPECIMENS/i }).click();
  const strength = page.locator('input[type="range"][title*="Local implementation strength"]');
  await expect(strength).toBeVisible();
  await strength.fill('35');
  await expect(page.getByText('35%', { exact: true })).toBeVisible();
  expect(consultBodies).toHaveLength(0);

  const engageButtons = page.getByRole('button', { name: /ENGAGE/i });
  await expect(engageButtons.first()).toBeVisible();
  expect(await engageButtons.count()).toBeGreaterThanOrEqual(2);
  await engageButtons.nth(0).click();
  await engageButtons.nth(1).click();
  await page.waitForTimeout(250);
  expect(consultBodies).toHaveLength(0);
  await expect(workbench.locator('.david-app-workbench__status')).toContainText('LOCAL STAGED');

  const applyLab = page.getByRole('button', { name: /APPLY LAB .* DAVID/i });
  await expect(applyLab).toBeEnabled();
  await applyLab.click();
  await expect.poll(() => consultBodies.length).toBe(1);
  const labBodyText = JSON.stringify(consultBodies[0]);
  expect(labBodyText).toContain('Mutation Lab Apply');
  expect(labBodyText.match(/IMPLEMENTATION STRENGTH: 35%/g)?.length || 0).toBeGreaterThanOrEqual(2);
  await expect(mainPrompt).toHaveValue(/QA RECONCILED PROMPT/);
  await expect(workbench.locator('.david-app-workbench__status')).toContainText('PROMPT COMMITTED');

  const instrumentalButton = page.locator('#toggle-instrumental-btn');
  await expect(instrumentalButton).toBeVisible();
  const promptBeforeInstrumental = await mainPrompt.inputValue();
  await instrumentalButton.click();
  await expect.poll(() => consultBodies.length).toBe(2);
  await expect(mainPrompt).toHaveValue(/QA INSTRUMENTAL PROMPT/);
  expect(await mainPrompt.inputValue()).not.toBe(`${promptBeforeInstrumental} (Instrumental)`);

  await workbench.getByRole('button', { name: /UNDO DAVID/i }).click();
  await expect(mainPrompt).toHaveValue(promptBeforeInstrumental);

  await workbench.getByRole('button', { name: /SYNTHESIZE THIS/i }).click();
  await expect.poll(() => synthBodies.length).toBe(1);
  expect(synthBodies[0].concept).toBe(promptBeforeInstrumental);
  expect(synthBodies[0].workbenchSourceOfTruth).toBe(true);
  expect(synthBodies[0].enableMutationEngine).toBe(false);
  expect(synthBodies[0].selectedSlopSeeds).toEqual([]);
  expect(synthBodies[0].selectedOperators).toEqual([]);
  expect(synthBodies[0].selectedAttractors).toEqual([]);
  await expect(page.getByText('LITERAL QA OUTPUT')).toBeVisible();

  await page.screenshot({ path: testInfo.outputPath('desktop-violent-qa.png'), fullPage: false });
  expect(runtime.pageErrors, `page errors: ${runtime.pageErrors.join(' | ')}`).toEqual([]);
  expect(runtime.consoleErrors, `console errors: ${runtime.consoleErrors.join(' | ')}`).toEqual([]);
});

test('mobile: workbench tabs, local locks, notepad persistence, no accidental consult', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const runtime = collectRuntimeErrors(page);
  const consultBodies: any[] = [];
  await mockConsult(page, (body) => consultBodies.push(body));

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /ENTER DAVID CONSOLE/i }).click();
  const workbench = page.locator('.david-app-workbench');
  await expect(workbench).toBeVisible();
  const tabs = workbench.getByRole('navigation', { name: 'Workbench sections' });
  await expect(tabs).toBeVisible();
  for (const label of ['PROMPT', 'LOCKS', 'DAVID', 'NOTES']) {
    await expect(tabs.getByRole('button', { name: new RegExp(label, 'i') })).toBeVisible();
  }

  await tabs.getByRole('button', { name: /LOCKS/i }).click();
  const locksPanel = workbench.locator('[data-mobile-panel="locks"]');
  await expect(locksPanel).toBeVisible();
  await locksPanel.getByRole('button', { name: 'maximalist', exact: true }).click();
  expect(await locksPanel.locator('input').nth(1).inputValue()).toBe('maximalist');
  await page.waitForTimeout(250);
  expect(consultBodies).toHaveLength(0);

  await tabs.getByRole('button', { name: /NOTES/i }).click();
  const notesPanel = workbench.locator('[data-mobile-panel="notes"]');
  await expect(notesPanel).toBeVisible();
  await notesPanel.getByTitle('Pop notepad out into a floating scratch window').click();
  const dialog = page.getByRole('dialog', { name: /Merry's floating notepad/i });
  await expect(dialog).toBeVisible();
  const noteText = 'QA NOTE — local only — do not send to DAVID';
  await dialog.locator('textarea').fill(noteText);
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => localStorage.getItem('david_workbench_notepad_v2'))).toBe(noteText);
  expect(consultBodies).toHaveLength(0);

  await page.screenshot({ path: testInfo.outputPath('mobile-workbench-qa.png'), fullPage: false });
  expect(runtime.pageErrors, `page errors: ${runtime.pageErrors.join(' | ')}`).toEqual([]);
  expect(runtime.consoleErrors, `console errors: ${runtime.consoleErrors.join(' | ')}`).toEqual([]);
  await context.close();
});

test('backend health: deployed DAVID functions answer without invoking generation', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/api/health`);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.status).toBe('ok');
  expect(body.entity).toBe('DAVID');
  expect(body.runtime).toBe('netlify-function');
  expect(body.apiKeyConfigured).toBe(true);
});

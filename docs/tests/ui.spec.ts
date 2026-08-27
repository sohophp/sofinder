import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

async function openAndAudit(page: Page, path: string) {
  const consoleErrors: string[] = []
  const failedResponses: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => consoleErrors.push(error.message))
  page.on('response', (response) => {
    if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`)
  })

  await page.goto(path, { waitUntil: 'networkidle' })
  await expect.poll(() => page.evaluate(() => document.fonts.status)).toBe('loaded')

  expect(failedResponses).toEqual([])
  expect(consoleErrors).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

  const accessibility = await new AxeBuilder({ page }).analyze()
  expect(accessibility.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')).toEqual([])
}

test('desktop home keeps its primary hierarchy', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await openAndAudit(page, '/')

  await expect(page.getByRole('heading', { name: /Secure file management/ })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible()
  await expect(page.locator('.VPFeature')).toHaveCount(6)
  await expect(page.locator('.sf-hero-terminal')).toBeVisible()
  await expect(page).toHaveScreenshot('home-desktop.png')
})

test('desktop documentation keeps the three-column layout', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await openAndAudit(page, '/getting-started')

  await expect(page.locator('.VPSidebar')).toBeVisible()
  await expect(page.locator('.VPDocAsideOutline')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Installation and quick start' })).toBeVisible()
  await expect(page.locator('.sf-doc-feedback')).toBeVisible()
  await expect(page).toHaveScreenshot('documentation-desktop.png')
})

test('mobile dark home remains localized and overflow-free', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' })
  await openAndAudit(page, '/zh-CN/')

  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page.getByRole('heading', { name: /安全的文件管理/ })).toBeVisible()
  await expect(page.locator('.VPNavBarHamburger')).toBeVisible()
  // Linux hosts can use different CJK fallback fonts; keep structural drift strict
  // while allowing the small glyph-rasterization difference seen in CI.
  await expect(page).toHaveScreenshot('home-mobile-dark.png', { maxDiffPixelRatio: 0.025 })
})

test('mobile documentation uses the native drawer and page outline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' })
  await openAndAudit(page, '/zh-CN/getting-started')

  await expect(page.locator('.VPNavBarHamburger')).toBeVisible()
  await expect(page.locator('.VPLocalNavOutlineDropdown')).toBeVisible()
  await expect(page.getByRole('heading', { name: '安装与快速开始' })).toBeVisible()
  await expect(page).toHaveScreenshot('documentation-mobile-dark.png', { maxDiffPixelRatio: 0.025 })
})

test('local search exposes page and section results', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/', { waitUntil: 'networkidle' })

  await page.locator('.DocSearch-Button').click()
  const search = page.locator('.VPLocalSearchBox')
  await expect(search).toBeVisible()
  await search.locator('input').fill('private storage')
  await expect(search.locator('a').first()).toBeVisible()
  await expect(search).toContainText(/Security|Private|安全/i)
})

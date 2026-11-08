import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BASE = process.env.SHOT_BASE ?? 'http://127.0.0.1:8780'
const OUT = path.join(ROOT, 'docs/presentation')
await mkdir(OUT, { recursive: true })

const chrome =
  process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined

const browser = await chromium.launch({ headless: true, executablePath: chrome })

const routes = [
  { name: 'landing', path: '/' },
  { name: 'home', path: '/app?demo=1' },
  { name: 'communities', path: '/app/communities?demo=1' },
  { name: 'help', path: '/app/help?demo=1' },
  { name: 'beacon', path: '/app/beacon/new?demo=1' },
  { name: 'activity', path: '/app/activity?demo=1' },
  { name: 'profile', path: '/app/profile?demo=1' },
]

async function shoot(size) {
  const context = await browser.newContext({
    viewport: size.viewport,
    deviceScaleFactor: size.dpr,
    isMobile: size.mobile,
    hasTouch: size.mobile,
  })
  const page = await context.newPage()
  for (const route of routes) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 45000 })
    await page.waitForTimeout(500)
    const file = path.join(OUT, `${size.prefix}-${route.name}-${size.label}.png`)
    await page.screenshot({ path: file, fullPage: false })
    console.log('wrote', path.relative(ROOT, file))
  }
  await context.close()
}

await shoot({
  label: 'mobile-390',
  prefix: '10',
  viewport: { width: 390, height: 844 },
  dpr: 2,
  mobile: true,
})
await shoot({
  label: 'desktop',
  prefix: '20',
  viewport: { width: 1280, height: 800 },
  dpr: 1,
  mobile: false,
})
await browser.close()
console.log('done')

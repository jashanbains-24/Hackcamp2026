import { defineConfig } from '@playwright/test'
import { chromiumLaunchOptions } from 'deepspace/testing'

/**
 * Port comes from $DEEPSPACE_PORT (set by `deepspace test run [--port N]`),
 * defaulting to 5173. The same port is passed to vite via --strictPort so
 * a busy address fails fast rather than silently rebinding to 5174.
 *
 * The test runner owns this server. A busy port is a hard failure so a test
 * can never attach to an unrelated or shutting-down app. To run suites in
 * parallel, give each one a different --port.
 */
const PORT = Number(process.env.DEEPSPACE_PORT ?? 5173)
// Use the address the test server binds to. New Chromium releases can apply
// Local Network Access checks to top-level `localhost` navigation in an agent
// container; the explicit loopback address keeps the browser and Vite on the
// same local origin without relying on hostname classification.
const BASE_URL = `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: BASE_URL,
    headless: true,
    launchOptions: {
      ...chromiumLaunchOptions(),
      executablePath:
        process.platform === 'darwin'
          ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
          : undefined,
    },
  },
  webServer: {
    // Bind the local test server directly. A bare `--host` asks Vite to
    // enumerate every interface, which fails in restricted containers before
    // the app can start (`uv_interface_addresses`).
    command: `npx vite --port ${PORT} --strictPort --host 127.0.0.1`,
    cwd: '..',
    // Phase 0 is mock-only and intentionally boots without a registered
    // DeepSpace account, so readiness gates on the public landing page.
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 60_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})

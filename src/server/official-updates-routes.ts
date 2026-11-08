import type { Hono } from 'hono'
import type { AppContext } from '../../worker.js'
import { getOfficialUpdates } from './official-updates.js'

export function registerOfficialUpdatesRoutes(app: Hono<AppContext>): void {
  app.get('/api/official-updates', async (c) => {
    const forceRefresh = c.req.query('refresh') === '1'
    const payload = await getOfficialUpdates({ forceRefresh })
    const statusCode = payload.status === 'error' ? 503 : 200
    c.header('Cache-Control', 'public, max-age=60')
    return c.json(payload, statusCode)
  })
}

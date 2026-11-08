#!/usr/bin/env node
/**
 * Minimal static server for UI smoke when the Cloudflare Vite plugin cannot
 * start (sandbox file-watch limits). Serves dist/client with SPA fallback.
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const port = Number(process.argv[2] ?? process.env.DEEPSPACE_PORT ?? 5173)
const root = fileURLToPath(new URL('../dist/client', import.meta.url))

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
}

async function readSafe(pathname) {
  const cleaned = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  const filePath = join(root, cleaned)
  if (!filePath.startsWith(root)) return null
  try {
    const info = await stat(filePath)
    if (!info.isFile()) return null
    return filePath
  } catch {
    return null
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://127.0.0.1:${port}`)
  const path = url.pathname === '/' ? '/index.html' : url.pathname
  let filePath = await readSafe(path)
  if (!filePath && !extname(path)) {
    filePath = await readSafe('/index.html')
  }
  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not found')
    return
  }
  const body = await readFile(filePath)
  res.writeHead(200, { 'Content-Type': types[extname(filePath)] ?? 'application/octet-stream' })
  res.end(body)
})

server.listen(port, '127.0.0.1', () => {
  console.log(`static smoke server on http://127.0.0.1:${port}`)
})

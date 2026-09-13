/**
 * Static file server for the visual build, with the SPA fallback the router
 * needs: any path that is not a real file is answered with index.html so
 * `/admin/kho` loads the app instead of 404ing.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(here, '.build')
const port = Number(process.env.VISUAL_PORT ?? 4321)

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error(`No build at ${dist}. Run: yarn visual:build`)
  process.exit(1)
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
}

const send = (res, file, status = 200) => {
  const type = TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream'
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' })
  fs.createReadStream(file).pipe(res)
}

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0])
    // Resolve inside dist and reject anything that escapes it.
    const candidate = path.join(dist, path.normalize(url))
    const inside = candidate === dist || candidate.startsWith(dist + path.sep)

    if (inside && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      send(res, candidate)
      return
    }

    send(res, path.join(dist, 'index.html'))
  })
  .listen(port, '127.0.0.1', () => console.log(`visual build served on http://127.0.0.1:${port}`))

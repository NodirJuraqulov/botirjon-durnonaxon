import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const port = Number(process.env.PORT || 5173)

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(body))
}

function safeFilePath(pathname) {
  const decoded = decodeURIComponent(pathname.split('?')[0])
  const relative = normalize(decoded).replace(/^([/\\])+/, '')
  const candidate = resolve(root, relative || 'index.html')
  return candidate.startsWith(root) ? candidate : null
}

const server = createServer((req, res) => {
  if (!req.url) return sendJson(res, 400, { error: 'Bad request' })

  if (req.url.startsWith('/api/wishes')) {
    return sendJson(res, 503, { error: 'Cloud guestbook is available when running through Vercel; local preview uses browser storage.' })
  }

  let filePath = safeFilePath(req.url)
  if (!filePath) return sendJson(res, 403, { error: 'Forbidden' })

  if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html')
  if (!existsSync(filePath)) filePath = join(root, 'index.html')

  const type = mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream'
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' })
  createReadStream(filePath).pipe(res)
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Wedding invitation preview: http://localhost:${port}`)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

test('renders the approved invitation sections in the requested order', () => {
  const ids = ['intro', 'couple', 'verse', 'details', 'countdown', 'location', 'wishes', 'thanks']
  const positions = ids.map((id) => html.indexOf(`id="${id}"`))
  assert.ok(positions.every((value) => value >= 0), 'every approved section exists')
  assert.deepEqual([...positions].sort((a, b) => a - b), positions)
})

test('contains approved wedding data and no program or RSVP section', () => {
  assert.match(html, /Botirjon/)
  assert.match(html, /Durdonaxon/)
  assert.match(html, /26\.09\.2026/)
  assert.match(html, /15:00/)
  assert.match(html, /Oqsaroy to['’‘]yxona/)
  assert.doesNotMatch(html, /<section[^>]+id="program"/i)
  assert.doesNotMatch(html, /<section[^>]+id="rsvp"/i)
})

test('provides an npm dev command for local preview', () => {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  assert.equal(packageJson.scripts?.dev, 'node scripts/dev-server.mjs')
  const devServer = readFileSync(new URL('../scripts/dev-server.mjs', import.meta.url), 'utf8')
  assert.match(devServer, /createServer/)
})

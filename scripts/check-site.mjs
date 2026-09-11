import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const required = [
  'index.html',
  'styles.css',
  'app.js',
  'lib/countdown.mjs',
  'lib/wishes.mjs',
  'assets/floral-corner.svg',
  'assets/floral-wreath.svg',
  'public/audio/botirjon-durdonaxon.mp3',
  'api/wishes.js',
  'vercel.json',
]
for (const file of required) {
  const size = statSync(resolve(root, file)).size
  if (size <= 0) throw new Error(`${file} is empty`)
}
const html = readFileSync(resolve(root, 'index.html'), 'utf8')
const css = readFileSync(resolve(root, 'styles.css'), 'utf8')
const app = readFileSync(resolve(root, 'app.js'), 'utf8')

for (const token of ['id="intro"', 'id="couple"', 'id="verse"', 'id="details"', 'id="countdown"', 'id="location"', 'id="wishes"', 'id="thanks"']) {
  if (!html.includes(token)) throw new Error(`Missing ${token}`)
}
if (!html.includes('/public/audio/botirjon-durdonaxon.mp3')) throw new Error('Audio source is missing')
if (!css.includes('@media (prefers-reduced-motion: reduce)')) throw new Error('Reduced-motion support is missing')
if (!app.includes("2026-09-26T15:00:00+05:00")) throw new Error('Countdown target is wrong')
if (!app.includes("fetch('/api/wishes'")) throw new Error('Guestbook API integration is missing')
if (!css.includes('@keyframes floral-float')) throw new Error('Floral motion is missing')
if (!css.includes('@keyframes wreath-sway')) throw new Error('Wreath motion is missing')
if (!app.includes('setupWishAutoScroll')) throw new Error('Wish auto-scroll is missing')
if (statSync(resolve(root, 'public/audio/botirjon-durdonaxon.mp3')).size < 1_000_000) throw new Error('Audio file looks incomplete')
console.log('Static site checks passed.')

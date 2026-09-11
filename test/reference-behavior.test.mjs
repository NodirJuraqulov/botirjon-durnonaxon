import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8')
const js = readFileSync(new URL('../app.js', import.meta.url), 'utf8')

test('matches the requested page order with title first, couple second, wishes penultimate and thanks last', () => {
  const ids = ['intro', 'couple', 'verse', 'details', 'countdown', 'location', 'wishes', 'thanks']
  const positions = ids.map((id) => html.indexOf(`id="${id}"`))
  assert.ok(positions.every((value) => value >= 0), 'all requested sections exist')
  assert.deepEqual([...positions].sort((a, b) => a - b), positions)
  assert.match(html.slice(positions[0], positions[1]), /ASSALOMU ALAYKUM/)
  assert.match(html.slice(positions[0], positions[1]), />TAKLIFNOMA</)
  assert.match(html.slice(positions[1], positions[2]), /Botirjon/)
  assert.match(html.slice(positions[1], positions[2]), /Durdonaxon/)
})

test('decorative flowers and the center wreath have persistent gentle motion hooks', () => {
  assert.match(html, /class="[^"]*wreath[^"]*wreath--motion/)
  assert.match(css, /@keyframes\s+floral-float/)
  assert.match(css, /@keyframes\s+wreath-sway/)
  assert.match(css, /\.wreath--motion\s*\{[^}]*animation:/s)
  assert.match(css, /\.floral\s*\{[^}]*animation:/s)
})

test('wishes stay inside their own viewport and support gentle automatic scrolling', () => {
  assert.match(html, /data-wishes-scroll/)
  assert.match(css, /\.wishes-list\s*\{[^}]*overflow-y:\s*hidden/s)
  assert.match(js, /function\s+setupWishAutoScroll/)
  assert.match(js, /requestAnimationFrame/)
})


test('keeps the couple names visually inside the floral wreath instead of below it', () => {
  const coupleStart = html.indexOf('<section class="section section--couple"')
  const verseStart = html.indexOf('<section class="section" id="verse"')
  const coupleMarkup = html.slice(coupleStart, verseStart)
  const wreathStart = coupleMarkup.indexOf('<div class="wreath-stage')
  const wreathEnd = coupleMarkup.indexOf('</div>', wreathStart)
  const titlePos = coupleMarkup.indexOf('class="couple-title"')
  assert.ok(wreathStart >= 0 && titlePos > wreathStart && titlePos < wreathEnd, 'couple title is nested inside wreath stage')
  assert.match(css, /\.wreath-stage\s*\{[^}]*position:\s*relative/s)
  assert.match(css, /\.couple-title\s*\{[^}]*position:\s*absolute/s)
  assert.doesNotMatch(css, /\.couple-title\s*\{[^}]*margin:\s*-[^;}]+/s)
})


test('couple wreath uses a large desktop stage so the visible floral ring matches the reference scale', () => {
  assert.match(css, /\.wreath-stage\s*\{[^}]*width:\s*min\(90vw,\s*520px\)/s)
  assert.match(css, /\.couple-title\s*\{[^}]*font-size:\s*clamp\(38px,\s*4vw,\s*50px\)/s)
})

test('wishes page uses the compact borderless reference list and a narrow anchored form', () => {
  assert.match(css, /\.section-inner--wishes\s*\{[^}]*width:\s*min\(100%,\s*520px\)/s)
  assert.match(css, /\.wish-card\s*\{[^}]*background:\s*transparent/s)
  assert.match(css, /\.wish-card\s*\{[^}]*border:\s*0/s)
  assert.match(css, /\.wish-card\s*\{[^}]*box-shadow:\s*none/s)
  assert.match(css, /\.wish-form\s*\{[^}]*max-width:\s*480px/s)
  assert.doesNotMatch(js, /<time datetime=/)
})

test('couple wreath keeps the large flowers fully inside the SVG viewport and spaces labels away from it', () => {
  const wreathSvg = readFileSync(new URL('../assets/floral-wreath.svg', import.meta.url), 'utf8')
  assert.match(wreathSvg, /transform="translate\(260 125\)"/)
  assert.match(wreathSvg, /transform="translate\(260 395\)"/)
  assert.match(css, /\.section--couple \.eyebrow\s*\{[^}]*transform:\s*translateY\(-26px\)/s)
  assert.match(css, /\.section--couple \.intro-note\s*\{[^}]*transform:\s*translateY\(24px\)/s)
})

test('wishes page matches the warm gold and slate reference treatment with a fixed inner scrolling list', () => {
  assert.match(css, /\.section--wishes\s*\{[^}]*--wishes-gold:\s*#d2a72f/s)
  assert.match(css, /\.section--wishes\s*\{[^}]*--wishes-slate:\s*#596273/s)
  assert.match(css, /\.wishes-window\s*\{[^}]*height:\s*360px/s)
  assert.match(css, /\.wishes-list\s*\{[^}]*height:\s*100%/s)
  assert.match(css, /\.section--wishes \.script-heading\s*\{[^}]*font-size:\s*38px/s)
  assert.match(css, /\.wish-card strong\s*\{[^}]*color:\s*var\(--wishes-gold\)/s)
  assert.match(css, /\.wish-card p\s*\{[^}]*color:\s*var\(--wishes-slate\)/s)
})


test('location uses the supplied Yandex Maps coordinates for both preview and open button', () => {
  assert.match(html, /https:\/\/yandex\.uz\/map-widget\/v1\/\?ll=70\.787873%2C40\.336535[^"']*z=16/)
  assert.match(html, /href="https:\/\/yandex\.uz\/maps\/\?ll=70\.787873%2C40\.336535&amp;pt=70\.787873%2C40\.336535%2Cpm2rdm&amp;z=16"/)
})

test('wishes auto-scroll downward without requiring or exposing manual scrolling', () => {
  assert.match(css, /\.wishes-list\s*\{[^}]*overflow-y:\s*hidden/s)
  assert.doesNotMatch(html, /data-wishes-scroll[^>]*tabindex=/)
  const autoScrollStart = js.indexOf('function setupWishAutoScroll()')
  const autoScrollEnd = js.indexOf('function setupWishes()', autoScrollStart)
  const autoScrollCode = js.slice(autoScrollStart, autoScrollEnd)
  assert.match(autoScrollCode, /const speed = 8/)
  assert.match(autoScrollCode, /list\.scrollTop \+= speed \* \(delta \/ 1000\)/)
  assert.doesNotMatch(autoScrollCode, /addEventListener\('(pointerdown|wheel|touchstart|mouseenter|mouseleave|focusin|focusout)'/)
})

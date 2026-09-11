import { getCountdown, padCountdownValue } from './lib/countdown.mjs'
import { normalizeWishInput, prependWish, readLocalWishes, saveLocalWishes } from './lib/wishes.mjs'

const WEDDING_TIME = new Date('2026-09-26T15:00:00+05:00')
const seedWishes = [
  { id: 'seed-1', name: 'Feruza', message: 'Botirjon va Durdonaxon, sizlarni chin dildan tabriklayman! Umr yo‘lingiz hamisha baxt, muhabbat va totuvlik bilan to‘lsin!', createdAt: '2026-09-10T09:00:00.000Z' },
  { id: 'seed-2', name: 'Dilshoda', message: 'Azizlar, sizlarga mustahkam oila, sog‘lom farzandlar va bir-biringizni doim qadrlab yashashni tilayman!', createdAt: '2026-09-09T14:30:00.000Z' },
  { id: 'seed-3', name: 'Muhammadali', message: 'Hayotingizning har bir kuni bugungi kun kabi chiroyli va unutilmas bo‘lsin!', createdAt: '2026-09-08T18:20:00.000Z' },
  { id: 'seed-4', name: 'Gulhayo', message: 'Baxtli bo‘ling! Sizlar bir-biringiz uchun yaratilgansiz. Doim shunday sevishib yashang! ❤️', createdAt: '2026-09-08T10:10:00.000Z' },
  { id: 'seed-5', name: 'Dilnoza', message: 'Jonim dugonam, baxt oqshoming muborak bo‘lsin. Baxt va omad hamisha hamrohing bo‘lsin!', createdAt: '2026-09-07T16:40:00.000Z' },
  { id: 'seed-6', name: 'Mavluda', message: 'Ilohim baxtli bo‘linglar, baxtlaringiz ham o‘zlaringizga o‘xshagan go‘zal bo‘lsin! 💕', createdAt: '2026-09-07T09:15:00.000Z' },
  { id: 'seed-7', name: 'Zuhra', message: 'Yangi hayot yo‘lingizga faqat yaxshiliklar, mehr va baraka tilayman.', createdAt: '2026-09-06T12:00:00.000Z' },
]

const $ = (selector, root = document) => root.querySelector(selector)
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]

function setupReveals() {
  const items = $$('.reveal')
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'))
    return
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.18 })
  items.forEach((item) => observer.observe(item))
}

function setupScrollCues() {
  $$('[data-scroll-next]').forEach((button) => {
    button.addEventListener('click', () => {
      const current = button.closest('.section')
      const next = current?.nextElementSibling
      if (next instanceof HTMLElement) next.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })
}

function setupPetals() {
  const field = $('.petal-field')
  if (!field || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  for (let i = 0; i < 15; i += 1) {
    const petal = document.createElement('span')
    petal.className = 'petal'
    petal.style.left = `${Math.random() * 100}%`
    petal.style.animationDuration = `${13 + Math.random() * 13}s`
    petal.style.animationDelay = `${Math.random() * -20}s`
    petal.style.transform = `scale(${0.7 + Math.random() * 0.8})`
    field.append(petal)
  }
}

function updateCountdown() {
  const value = getCountdown(WEDDING_TIME, new Date())
  for (const key of ['days', 'hours', 'minutes', 'seconds']) {
    const node = document.querySelector(`[data-count="${key}"]`)
    if (node) node.textContent = padCountdownValue(value[key])
  }
  const message = $('[data-countdown-message]')
  if (message && value.complete) message.textContent = 'Bugun bizning baxtli kunimiz!'
}

function setupCountdown() {
  updateCountdown()
  setInterval(updateCountdown, 1000)
}

function setupMusic() {
  const audio = $('[data-audio]')
  const button = $('[data-music-toggle]')
  if (!(audio instanceof HTMLAudioElement) || !(button instanceof HTMLButtonElement)) return
  let interactionTried = false

  const sync = () => {
    const playing = !audio.paused
    button.classList.toggle('is-playing', playing)
    button.setAttribute('aria-pressed', String(playing))
    button.setAttribute('aria-label', playing ? 'Musiqani to‘xtatish' : 'Musiqani yoqish')
  }
  const tryPlay = async () => {
    try { await audio.play() } catch { /* autoplay may be blocked */ }
    sync()
  }
  button.addEventListener('click', async (event) => {
    event.stopPropagation()
    if (audio.paused) await tryPlay()
    else audio.pause()
    sync()
  })
  const startAfterInteraction = (event) => {
    if (interactionTried) return
    if (event?.target instanceof Element && event.target.closest('[data-music-toggle]')) return
    interactionTried = true
    void tryPlay()
  }
  window.addEventListener('pointerdown', startAfterInteraction, { once: true, passive: true })
  window.addEventListener('keydown', startAfterInteraction, { once: true })
  audio.addEventListener('play', sync)
  audio.addEventListener('pause', sync)
  sync()
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char])
}

function wishDate(iso) {
  try { return new Intl.DateTimeFormat('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso)) } catch { return '' }
}

function renderWishes(wishes) {
  const list = $('[data-wishes-list]')
  if (!list) return

  const cards = wishes.slice(0, 30).map((wish) => `
    <article class="wish-card">
      <div class="wish-avatar" aria-hidden="true">
        ${escapeHtml(wish.name.slice(0, 1).toUpperCase())}
      </div>

      <div>
        <strong>${escapeHtml(wish.name)}</strong>
        <p>${escapeHtml(wish.message)}</p>
      </div>
    </article>
  `).join('')

  list.innerHTML = `
    <div class="wishes-loop-group">
      ${cards}
    </div>

    <div class="wishes-loop-group" aria-hidden="true">
      ${cards}
    </div>
  `
}

async function fetchCloudWishes() {
  const response = await fetch('/api/wishes', { headers: { accept: 'application/json' } })
  if (!response.ok) throw new Error('cloud unavailable')
  const data = await response.json()
  return Array.isArray(data.wishes) ? data.wishes : []
}

async function postCloudWish(input) {
  const response = await fetch('/api/wishes', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) throw new Error('cloud unavailable')
  return response.json()
}


function setupWishAutoScroll() {
  const list = $('[data-wishes-scroll]')

  if (!(list instanceof HTMLElement)) return

  let lastTime = performance.now()

  // TEZLIKNI SHU YERDAN O'ZGARTIRASIZ
  const speed = 160 // px per second

  const tick = (now) => {
    const delta = Math.min(now - lastTime, 80)
    lastTime = now

    const loopHeight = list.scrollHeight / 2

    if (loopHeight > list.clientHeight) {
      list.scrollTop += speed * (delta / 1000)

      // Birinchi nusxa tugaganda ikkinchi nusxaning
      // aynan bir xil joyiga o'tadi — ko'zga bilinmaydi.
      if (list.scrollTop >= loopHeight) {
        list.scrollTop -= loopHeight
      }
    }

    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

function setupWishes() {
  const form = $('[data-wish-form]')
  const status = $('[data-form-status]')
  if (!(form instanceof HTMLFormElement)) return
  let wishes = [...readLocalWishes(), ...seedWishes]
  const unique = new Map(wishes.map((wish) => [wish.id, wish]))
  wishes = [...unique.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  renderWishes(wishes)

  fetchCloudWishes().then((cloud) => {
    if (!cloud.length) return
    const merged = new Map([...cloud, ...wishes].map((wish) => [wish.id, wish]))
    wishes = [...merged.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    renderWishes(wishes)
  }).catch(() => {})

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const formData = new FormData(form)
    try {
      const input = normalizeWishInput(formData.get('name'), formData.get('message'))
      if (status) status.textContent = 'Tilagingiz yuborilmoqda...'
      let wish
      try {
        const cloud = await postCloudWish(input)
        wish = cloud.wish
      } catch {
        wishes = prependWish(wishes, input)
        wish = wishes[0]
        const locals = readLocalWishes()
        saveLocalWishes([wish, ...locals.filter((item) => item.id !== wish.id)])
      }
      wishes = [wish, ...wishes.filter((item) => item.id !== wish.id)]
      renderWishes(wishes)
      form.reset()
      if (status) status.textContent = 'Rahmat! Tilagingiz saqlandi. ♥'
    } catch (error) {
      if (status) status.textContent = error instanceof Error ? error.message : 'Iltimos, maydonlarni to‘ldiring.'
    }
  })
}

setupReveals()
setupScrollCues()
setupPetals()
setupCountdown()
setupMusic()
setupWishes()
setupWishAutoScroll()

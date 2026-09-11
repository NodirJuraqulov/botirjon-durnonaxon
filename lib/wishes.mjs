export const LOCAL_WISHES_KEY = 'botirjon-durdonaxon-wishes-v1'

export function normalizeWishInput(name, message) {
  const cleanName = String(name ?? '').trim().replace(/\s+/g, ' ')
  const cleanMessage = String(message ?? '').trim().replace(/\s+/g, ' ')
  if (!cleanName) throw new Error('Ismingizni kiriting')
  if (!cleanMessage) throw new Error('Tilagingizni kiriting')
  if (cleanName.length > 60) throw new Error('Ism juda uzun')
  if (cleanMessage.length > 500) throw new Error('Tilak juda uzun')
  return { name: cleanName, message: cleanMessage }
}

export function prependWish(list, input, id = crypto.randomUUID(), createdAt = new Date().toISOString()) {
  const normalized = normalizeWishInput(input.name, input.message)
  return [{ id, ...normalized, createdAt }, ...list]
}

export function readLocalWishes(storage = globalThis.localStorage) {
  if (!storage) return []
  try {
    const raw = storage.getItem(LOCAL_WISHES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveLocalWishes(wishes, storage = globalThis.localStorage) {
  if (!storage) return
  storage.setItem(LOCAL_WISHES_KEY, JSON.stringify(wishes))
}

export function writeLocalWish(input, storage = globalThis.localStorage) {
  const wishes = prependWish(readLocalWishes(storage), input)
  saveLocalWishes(wishes, storage)
  return wishes[0]
}

import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeWishInput, prependWish } from '../lib/wishes.mjs'

test('normalizes a valid wish', () => {
  assert.deepEqual(normalizeWishInput('  Feruza ', '  Baxtli bo‘ling!  '), {
    name: 'Feruza', message: 'Baxtli bo‘ling!'
  })
})

test('rejects empty name or message', () => {
  assert.throws(() => normalizeWishInput(' ', 'Tilak'), /Ismingizni kiriting/)
  assert.throws(() => normalizeWishInput('Ali', ' '), /Tilagingizni kiriting/)
})

test('prepends a normalized wish with generated metadata', () => {
  const list = [{ id: 'old', name: 'A', message: 'B', createdAt: '2026-09-01T00:00:00.000Z' }]
  const result = prependWish(list, { name: 'Ali', message: 'Baxtli bo‘ling!' }, 'new-id', '2026-09-11T00:00:00.000Z')
  assert.equal(result[0].id, 'new-id')
  assert.equal(result[0].name, 'Ali')
  assert.equal(result[1].id, 'old')
})

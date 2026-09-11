import test from 'node:test'
import assert from 'node:assert/strict'
import { getCountdown } from '../lib/countdown.mjs'

test('splits remaining time into days, hours, minutes and seconds', () => {
  const now = new Date('2026-09-25T09:29:20+05:00')
  const target = new Date('2026-09-26T15:00:00+05:00')
  assert.deepEqual(getCountdown(target, now), {
    days: 1,
    hours: 5,
    minutes: 30,
    seconds: 40,
    complete: false,
  })
})

test('returns zeroes at or after the wedding time', () => {
  const target = new Date('2026-09-26T15:00:00+05:00')
  assert.deepEqual(getCountdown(target, target), {
    days: 0, hours: 0, minutes: 0, seconds: 0, complete: true,
  })
  assert.deepEqual(getCountdown(target, new Date('2026-09-27T15:00:00+05:00')), {
    days: 0, hours: 0, minutes: 0, seconds: 0, complete: true,
  })
})

const json = (res, status, body) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

const config = () => ({
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_ANON_KEY,
})

const headers = (key) => ({
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
})

export default async function handler(req, res) {
  const { url, key } = config()
  if (!url || !key) return json(res, 503, { error: 'Guestbook cloud storage is not configured.' })
  const endpoint = `${url.replace(/\/$/, '')}/rest/v1/wedding_wishes`

  if (req.method === 'GET') {
    const response = await fetch(`${endpoint}?select=id,name,message,created_at&order=created_at.desc&limit=30`, { headers: headers(key) })
    if (!response.ok) return json(res, 502, { error: 'Could not load wishes.' })
    const rows = await response.json()
    return json(res, 200, { wishes: rows.map((row) => ({ id: String(row.id), name: row.name, message: row.message, createdAt: row.created_at })) })
  }

  if (req.method === 'POST') {
    const name = String(req.body?.name ?? '').trim().replace(/\s+/g, ' ')
    const message = String(req.body?.message ?? '').trim().replace(/\s+/g, ' ')
    if (!name || !message) return json(res, 400, { error: 'Name and message are required.' })
    if (name.length > 60 || message.length > 500) return json(res, 400, { error: 'Wish is too long.' })
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { ...headers(key), Prefer: 'return=representation' },
      body: JSON.stringify({ name, message }),
    })
    if (!response.ok) return json(res, 502, { error: 'Could not save wish.' })
    const [row] = await response.json()
    return json(res, 201, { wish: { id: String(row.id), name: row.name, message: row.message, createdAt: row.created_at } })
  }

  res.setHeader('Allow', 'GET, POST')
  return json(res, 405, { error: 'Method not allowed.' })
}

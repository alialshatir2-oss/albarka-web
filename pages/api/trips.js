import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { from, to, date } = req.query
    let query = supabase
      .from('trips')
      .select('*')
      .eq('status', 'متاحة')
      .or('seats.gt.0,vip_seats.gt.0')

    if (from) query = query.eq('from_city', from)
    if (to) query = query.eq('to_city', to)
    if (date) query = query.eq('date', date)

    const { data, error } = await query
    if (error) throw error

    res.status(200).json(data || [])
  } catch (e) {
    console.error('❌ trips API error:', e.message)
    res.status(500).json({ error: 'تعذر جلب الرحلات' })
  }
}

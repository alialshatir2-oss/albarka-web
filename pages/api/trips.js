import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  try {
    const { from, to, date } = req.query
    let query = supabase.from('trips').select('*').eq('status', 'متاحة')
    
    if (from) query = query.eq('from_city', from)
    if (to) query = query.eq('to_city', to)
    if (date) query = query.eq('date', date)

    const { data, error } = await query
    if (error) throw error

    res.status(200).json(data || [])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

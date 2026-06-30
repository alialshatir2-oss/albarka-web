import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('status', 'متاحة')
      .or('seats.gt.0,vip_seats.gt.0')
    if (error) throw error
    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

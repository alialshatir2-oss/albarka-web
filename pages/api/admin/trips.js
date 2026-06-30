import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default async function handler(req, res) {
  // GET: عرض الرحلات
  if (req.method === 'GET') {
    const { data } = await supabase.from('trips').select('*').order('date', { ascending: true })
    return res.status(200).json(data || [])
  }

  // POST: إضافة رحلة
  if (req.method === 'POST') {
    const { from_city, to_city, date, time, price, seats, vip_seats, status } = req.body
    const { error } = await supabase.from('trips').insert({ from_city, to_city, date, time, price: parseInt(price), seats: parseInt(seats), vip_seats: parseInt(vip_seats) || 0, status: status || 'متاحة' })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  // PUT: تعديل رحلة (السعر فقط هنا)
  if (req.method === 'PUT') {
    const { id } = req.query
    const { price } = req.body
    const { error } = await supabase.from('trips').update({ price: parseInt(price) }).eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  // DELETE: حذف رحلة
  if (req.method === 'DELETE') {
    const { id } = req.query
    const { error } = await supabase.from('trips').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }
}

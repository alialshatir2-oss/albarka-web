import { createClient } from '@supabase/supabase-js'
import moyasar from 'moyasar'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

moyasar.init({ secret_key: process.env.MOYASAR_SECRET_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  const { name, phone, tripId, seats, type } = req.body
  const apiSecret = req.headers['x-api-secret']
  
  // التحقق من المفتاح السري
  if (apiSecret !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // 1. إنشاء الحجز في Supabase
    const { data: trip } = await supabase.from('trips').select('*').eq('id', tripId).single()
    if (!trip) return res.status(404).json({ error: 'الرحلة غير موجودة' })

    const seatCol = type === 'VIP' ? 'vip_seats' : 'seats'
    const available = trip[seatCol]
    if (available < seats) return res.status(400).json({ error: `المقاعد ${type} المتبقية: ${available}` })

    const price = type === 'VIP' ? Math.round(trip.price * 1.5) : trip.price
    const total = price * seats
    const bookingId = 'BK' + Date.now()

    const { error: bookError } = await supabase.from('bookings').insert({
      booking_id: bookingId,
      customer_name: name,
      customer_phone: phone,
      trip_id: tripId,
      from_city: trip.from_city,
      to_city: trip.to_city,
      date: trip.date,
      time: trip.time,
      seats_booked: seats,
      seat_type: type,
      price_per_seat: price,
      total_price: total,
      status: 'معلق'
    })
    if (bookError) throw bookError

    // 2. إنشاء فاتورة Moyasar
    const invoice = await moyasar.invoices.create({
      amount: total * 100, // هللة
      currency: 'SAR',
      description: `حجز ${bookingId}`,
      callback_url: `${process.env.BASE_URL}/success`,
      metadata: { bookingId }
    })

    res.status(200).json({
      success: true,
      paymentUrl: invoice.url,
      bookingId
    })

  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

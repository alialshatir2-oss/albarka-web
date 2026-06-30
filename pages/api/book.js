import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  // ===== تتبع حجز (GET) =====
  if (req.method === 'GET') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'رقم الحجز مطلوب' })

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_id', id)
        .single()

      if (error || !data) {
        return res.status(404).json({ error: 'الحجز غير موجود' })
      }

      return res.status(200).json({ booking: data })
    } catch (e) {
      console.error('❌ book GET error:', e.message)
      return res.status(500).json({ error: 'تعذر جلب بيانات الحجز' })
    }
  }

  // ===== إنشاء حجز (POST) =====
  if (req.method === 'POST') {
    const { name, phone, tripId, seats, type } = req.body

    // تحقق أساسي
    if (!name || !phone || !tripId || !seats) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' })
    }

    const seatCount = parseInt(seats)
    if (isNaN(seatCount) || seatCount < 1) {
      return res.status(400).json({ error: 'عدد المقاعد غير صالح' })
    }

    const seatType = type === 'VIP' ? 'VIP' : 'عادي'

    try {
      // 1. جلب الرحلة
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single()

      if (tripError || !trip) {
        return res.status(404).json({ error: 'الرحلة غير موجودة' })
      }

      // 2. تحقق من المقاعد
      const seatCol = seatType === 'VIP' ? 'vip_seats' : 'seats'
      const available = trip[seatCol] || 0
      if (available < seatCount) {
        return res.status(400).json({ error: `المقاعد ${seatType} المتبقية: ${available} فقط` })
      }

      // 3. احسب السعر
      const pricePerSeat = seatType === 'VIP' ? Math.round(trip.price * 1.5) : trip.price
      const total = pricePerSeat * seatCount
      const bookingId = 'BK' + Date.now()

      // 4. أدخل الحجز
      const { error: bookError } = await supabase.from('bookings').insert({
        booking_id: bookingId,
        customer_name: name,
        customer_phone: phone,
        trip_id: tripId,
        from_city: trip.from_city,
        to_city: trip.to_city,
        date: trip.date,
        time: trip.time,
        seats_booked: seatCount,
        seat_type: seatType,
        price_per_seat: pricePerSeat,
        total_price: total,
        status: 'مؤكد'
      })

      if (bookError) throw bookError

      // 5. نقص المقاعد
      await supabase
        .from('trips')
        .update({ [seatCol]: available - seatCount })
        .eq('id', tripId)

      return res.status(200).json({
        success: true,
        bookingId,
        totalPrice: total,
        message: `تم الحجز بنجاح! رقم الحجز: ${bookingId}`
      })
    } catch (e) {
      console.error('❌ book POST error:', e.message)
      return res.status(500).json({ error: 'فشل إنشاء الحجز' })
    }
  }

  // طرق أخرى غير مدعومة
  return res.status(405).json({ error: 'Method not allowed' })
}

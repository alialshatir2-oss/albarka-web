import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const event = req.body
    // تأكد من توقيع Moyasar (يمكن إضافته لاحقاً)
    if (event.type === 'invoice.paid') {
      const bookingId = event.data.metadata.bookingId
      if (bookingId) {
        await supabase
          .from('bookings')
          .update({ status: 'مدفوع' })
          .eq('booking_id', bookingId)
        console.log(`✅ تم تأكيد دفع الحجز ${bookingId}`)
      }
    }
    res.status(200).json({ received: true })
  } catch (e) {
    console.error('❌ webhook error:', e.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

import { useState } from 'react'
import Layout from '../components/Layout'

export default function Track() {
  const [bookingId, setBookingId] = useState('')
  const [booking, setBooking] = useState(null)
  const [message, setMessage] = useState('')

  async function track() {
    setMessage('')
    try {
      const res = await fetch(`/api/book?id=${bookingId}`)
      const data = await res.json()
      if (data.booking) {
        setBooking(data.booking)
      } else {
        setMessage('الحجز غير موجود')
      }
    } catch (e) {
      setMessage('خطأ في الاتصال')
    }
  }

  return (
    <Layout showBack>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ color: '#0e5e4c', marginBottom: '20px' }}>🔍 تتبع الحجز</h2>
        <input
          placeholder="أدخل رقم الحجز"
          value={bookingId}
          onChange={e => setBookingId(e.target.value)}
        />
        <button className="btn" onClick={track} style={{ width: '100%' }}>
          بحث
        </button>
        {message && <p style={{ marginTop: '15px', color: 'red' }}>{message}</p>}
        {booking && (
          <div className="card" style={{ marginTop: '20px', background: '#f0f8f4' }}>
            <p><strong>🎫 رقم الحجز:</strong> {booking.booking_id}</p>
            <p><strong>🚌 الرحلة:</strong> {booking.from_city} → {booking.to_city}</p>
            <p><strong>📅 التاريخ:</strong> {booking.date} | <strong>⏰</strong> {booking.time}</p>
            <p><strong>👤 الاسم:</strong> {booking.customer_name}</p>
            <p><strong>💺 المقاعد:</strong> {booking.seats_booked} ({booking.seat_type})</p>
            <p><strong>💰 السعر:</strong> {booking.total_price} ريال</p>
            <p><strong>📌 الحالة:</strong> {booking.status}</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

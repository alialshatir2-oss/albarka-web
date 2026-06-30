import { useState } from 'react'

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
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', fontFamily: 'Cairo' }}>
      <h1>🔍 تتبع الحجز</h1>
      <input placeholder="رقم الحجز" value={bookingId} onChange={e => setBookingId(e.target.value)} />
      <button onClick={track} style={{ padding: '10px', background: '#0e5e4c', color: 'white', border: 'none', borderRadius: '5px' }}>بحث</button>
      {message && <p>{message}</p>}
      {booking && (
        <div className="card">
          <p>🎫 رقم الحجز: {booking.booking_id}</p>
          <p>🚌 {booking.from_city} → {booking.to_city}</p>
          <p>📅 {booking.date} | ⏰ {booking.time}</p>
          <p>الحالة: {booking.status}</p>
        </div>
      )}
    </div>
  )
}

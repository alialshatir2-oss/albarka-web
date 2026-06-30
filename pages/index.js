import { useState, useEffect } from 'react'

export default function Home() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    tripId: '',
    seats: '1',
    type: 'عادي'
  })

  useEffect(() => {
    fetchTrips()
  }, [])

  async function fetchTrips() {
    setLoading(true)
    try {
      const res = await fetch('/api/trips')
      const data = await res.json()
      setTrips(data)
    } catch (e) {
      setMessage('خطأ في الاتصال')
    }
    setLoading(false)
  }

  async function handleBook(e) {
    e.preventDefault()
    setMessage('جاري الحجز...')
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        // توجيه للدفع
        window.location.href = data.paymentUrl
      } else {
        setMessage(data.error || 'فشل الحجز')
      }
    } catch (e) {
      setMessage('خطأ في الاتصال')
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🚌 البركة للحجز</h1>
      
      <h2>الرحلات المتاحة</h2>
      {loading ? <p>جاري التحميل...</p> : (
        <table border="1" cellPadding="5" style={{ width: '100%', textAlign: 'center' }}>
          <thead>
            <tr>
              <th>الرقم</th>
              <th>المسار</th>
              <th>التاريخ</th>
              <th>الوقت</th>
              <th>السعر (عادي)</th>
              <th>المقاعد</th>
            </tr>
          </thead>
          <tbody>
            {trips.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.from_city} → {t.to_city}</td>
                <td>{t.date}</td>
                <td>{t.time}</td>
                <td>{t.price} ريال</td>
                <td>{t.seats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>حجز سريع</h2>
      <form onSubmit={handleBook}>
        <input placeholder="الاسم" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /><br/><br/>
        <input placeholder="رقم الجوال (9665xxxxxxxx)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required /><br/><br/>
        <input placeholder="رقم الرحلة" value={form.tripId} onChange={e => setForm({...form, tripId: e.target.value})} required /><br/><br/>
        <select value={form.seats} onChange={e => setForm({...form, seats: e.target.value})}>
          {[1,2,3,4,5].map(i => <option key={i} value={i}>{i} مقعد</option>)}
        </select><br/><br/>
        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
          <option value="عادي">عادي</option>
          <option value="VIP">VIP</option>
        </select><br/><br/>
        <button type="submit">احجز وادفع</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

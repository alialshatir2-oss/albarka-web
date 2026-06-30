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
    setMessage('جاري إرسال طلبك...')
    
    // حالياً: حجز مباشر بدون دفع فوري
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setMessage(`✅ تم استقبال طلبك! رقم الحجز: ${data.bookingId}. سيتواصل معك المندوب قريباً.`)
        setForm({ name: '', phone: '', tripId: '', seats: '1', type: 'عادي' })
      } else {
        setMessage(data.error || 'فشل الحجز')
      }
    } catch (e) {
      setMessage('خطأ في الاتصال')
    }
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', fontFamily: 'Tahoma, sans-serif' }}>
      {/* الهيدر */}
      <div style={{ background: '#0e3b2e', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>🚌 شركة البركة للنقل الجماعي</h1>
        <p style={{ margin: '5px 0 0' }}>حجز الرحلات بين المدن اليمنية والسعودية</p>
      </div>

      <div style={{ maxWidth: '700px', margin: '30px auto', padding: '0 15px' }}>
        
        {/* قسم الرحلات */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
          <h2 style={{ color: '#0e3b2e', borderBottom: '2px solid #0e3b2e', paddingBottom: '10px' }}>الرحلات المتاحة</h2>
          {loading ? <p>جاري التحميل...</p> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                <thead>
                  <tr style={{ background: '#0e3b2e', color: 'white' }}>
                    <th style={{ padding: '10px' }}>الرقم</th>
                    <th style={{ padding: '10px' }}>المسار</th>
                    <th style={{ padding: '10px' }}>التاريخ</th>
                    <th style={{ padding: '10px' }}>الوقت</th>
                    <th style={{ padding: '10px' }}>السعر (عادي)</th>
                    <th style={{ padding: '10px' }}>المقاعد</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((t, i) => (
                    <tr key={t.id} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      <td style={{ padding: '10px' }}>{t.id}</td>
                      <td style={{ padding: '10px' }}>{t.from_city} → {t.to_city}</td>
                      <td style={{ padding: '10px' }}>{t.date}</td>
                      <td style={{ padding: '10px' }}>{t.time}</td>
                      <td style={{ padding: '10px' }}>{t.price} ريال</td>
                      <td style={{ padding: '10px' }}>{t.seats}</td>
                    </tr>
                  ))}
                  {trips.length === 0 && !loading && (
                    <tr><td colSpan="6" style={{ padding: '20px', color: '#888' }}>لا توجد رحلات متاحة حالياً</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* نموذج الحجز */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ color: '#0e3b2e', borderBottom: '2px solid #0e3b2e', paddingBottom: '10px' }}>حجز سريع</h2>
          <form onSubmit={handleBook}>
            <input placeholder="الاسم الكامل" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ddd' }} />
            <input placeholder="رقم الجوال (9665xxxxxxxx)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ddd' }} />
            <input placeholder="رقم الرحلة (من الجدول)" value={form.tripId} onChange={e => setForm({...form, tripId: e.target.value})} required style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ddd' }} />
            
            <div style={{ display: 'flex', gap: '10px', margin: '8px 0' }}>
              <select value={form.seats} onChange={e => setForm({...form, seats: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }}>
                {[1,2,3,4,5,6,7,8,9,10].map(i => <option key={i} value={i}>{i} مقعد</option>)}
              </select>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }}>
                <option value="عادي">عادي</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <button type="submit" style={{ width: '100%', padding: '12px', background: '#0e3b2e', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', marginTop: '10px', cursor: 'pointer' }}>
              احجز الآن
            </button>
          </form>
          {message && <p style={{ marginTop: '15px', padding: '10px', background: '#e8f5e9', borderRadius: '5px', color: '#0e3b2e' }}>{message}</p>}
        </div>

        {/* تذييل */}
        <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
          <p>© 2026 شركة البركة للنقل الجماعي. جميع الحقوق محفوظة.</p>
          <p>📞 للتواصل: 966566480912</p>
        </div>
      </div>
    </div>
  )
}

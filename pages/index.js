import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: '',
    type: 'عادي'
  })
  const [step, setStep] = useState('search') // search | results | booking | confirm
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [passenger, setPassenger] = useState({ name: '', phone: '', seats: '1' })
  const [message, setMessage] = useState('')

  const cities = [
    'الدمام', 'الرياض', 'المدينة المنورة', 'جده', 'مكه', 'جيزان', 'شرورة',
    'صنعاء', 'الحديدة', 'ذمار', 'البيضاء', 'المكلا', 'عدن', 'تعز المدينة', 'تعز الحوبان', 'إب'
  ]

  async function searchTrips() {
    if (!form.from || !form.to || !form.date) {
      setMessage('يرجى ملء جميع الحقول')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/trips')
      const data = await res.json()
      const filtered = data.filter(t => 
        t.from_city === form.from &&
        t.to_city === form.to &&
        t.date === form.date
      )
      setTrips(filtered)
      setStep('results')
    } catch (e) {
      setMessage('تعذر الاتصال بالخادم')
    }
    setLoading(false)
  }

  async function confirmBooking() {
    setMessage('')
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: passenger.name,
          phone: passenger.phone,
          tripId: selectedTrip.id,
          seats: passenger.seats,
          type: form.type
        })
      })
      const data = await res.json()
      if (data.success) {
        setMessage(`✅ تم الحجز بنجاح! رقم الحجز: ${data.bookingId}`)
        setStep('confirm')
      } else {
        setMessage('❌ ' + (data.error || 'فشل الحجز'))
      }
    } catch (e) {
      setMessage('❌ خطأ في الاتصال')
    }
  }

  return (
    <>
      <Head>
        <title>البركة للنقل الجماعي - حجز الرحلات</title>
      </Head>
      <header style={{ background: '#0e5e4c', color: 'white', padding: '15px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '22px' }}>🚌 البركة للنقل</h1>
          <nav>
            <a href="/track" style={{ color: 'white', marginLeft: '20px', textDecoration: 'none' }}>تتبع الحجز</a>
          </nav>
        </div>
      </header>

      <main className="container" style={{ marginTop: '30px' }}>
        {/* محرك البحث */}
        <div className="card">
          <h2 style={{ marginBottom: '20px', color: '#0e5e4c' }}>🔍 ابحث عن رحلتك</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <select value={form.from} onChange={e => setForm({...form, from: e.target.value})}>
              <option value="">المغادرة من</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.to} onChange={e => setForm({...form, to: e.target.value})}>
              <option value="">الوصول إلى</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="عادي">عادي</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <button className="btn" onClick={searchTrips} disabled={loading} style={{ marginTop: '15px', width: '100%' }}>
            {loading ? 'جاري البحث...' : 'عرض الرحلات'}
          </button>
          {message && <p style={{ marginTop: '10px', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
        </div>

        {/* نتائج الرحلات */}
        {step === 'results' && (
          <div>
            <h2 style={{ color: '#0e5e4c', marginBottom: '15px' }}>🚌 رحلات {form.from} → {form.to} ({form.date})</h2>
            {trips.length === 0 ? (
              <div className="card">😔 لا توجد رحلات في هذا التاريخ.</div>
            ) : (
              trips.map(trip => (
                <div key={trip.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{trip.from_city} → {trip.to_city}</div>
                    <div>📅 {trip.date} | ⏰ {trip.time}</div>
                    <div style={{ color: '#0e5e4c', fontWeight: 'bold', marginTop: '5px' }}>
                      {trip.price} ريال ( {form.type === 'VIP' ? 'VIP' + Math.round(trip.price*1.5) : trip.price} )
                    </div>
                  </div>
                  <button className="btn" onClick={() => { setSelectedTrip(trip); setStep('booking') }}>
                    احجز الآن
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* بيانات المسافر وتأكيد */}
        {step === 'booking' && selectedTrip && (
          <div className="card">
            <h2 style={{ color: '#0e5e4c' }}>👤 بيانات المسافر</h2>
            <input placeholder="الاسم الكامل" value={passenger.name} onChange={e => setPassenger({...passenger, name: e.target.value})} />
            <input placeholder="رقم الجوال (9665xxxxxxxx)" value={passenger.phone} onChange={e => setPassenger({...passenger, phone: e.target.value})} />
            <select value={passenger.seats} onChange={e => setPassenger({...passenger, seats: e.target.value})}>
              {[1,2,3,4,5,6].map(i => <option key={i} value={i}>{i} مقعد</option>)}
            </select>
            <div style={{ marginTop: '15px', background: '#f0f8f4', padding: '15px', borderRadius: '8px' }}>
              <p><strong>الرحلة:</strong> {selectedTrip.from_city} → {selectedTrip.to_city}</p>
              <p><strong>التاريخ:</strong> {selectedTrip.date} | <strong>الوقت:</strong> {selectedTrip.time}</p>
              <p><strong>الإجمالي التقريبي:</strong> {selectedTrip.price * passenger.seats} ريال</p>
            </div>
            <button className="btn" onClick={confirmBooking} style={{ width: '100%', marginTop: '15px' }}>
              🎫 تأكيد الحجز
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>🎉 شكراً لك!</h2>
            <p>{message}</p>
            <button className="btn" onClick={() => { setStep('search'); setTrips([]); }}>حجز جديد</button>
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '20px', color: '#888', marginTop: '40px' }}>
        © 2026 البركة للنقل الجماعي
      </footer>
    </>
  )
}

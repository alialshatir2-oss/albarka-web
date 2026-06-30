import { useState } from 'react'
import Layout from '../components/Layout'

const CITIES = [
  'الدمام', 'الرياض', 'المدينة المنورة', 'جده', 'مكه', 'جيزان', 'شرورة',
  'صنعاء', 'الحديدة', 'ذمار', 'البيضاء', 'المكلا', 'عدن', 'تعز المدينة', 'تعز الحوبان', 'إب'
]

export default function Home() {
  const [step, setStep] = useState('search') // search | results | booking | confirm
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ from: '', to: '', date: '', type: 'عادي' })
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [passenger, setPassenger] = useState({ name: '', phone: '', seats: '1' })
  const [message, setMessage] = useState('')

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
        t.from_city === form.from && t.to_city === form.to && t.date === form.date
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
    <Layout showBack={step !== 'search'}>
      {step === 'search' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: '#0e5e4c', marginBottom: '20px' }}>🔍 اختر رحلتك</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <select value={form.from} onChange={e => setForm({...form, from: e.target.value})}>
              <option value="">المغادرة من</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.to} onChange={e => setForm({...form, to: e.target.value})}>
              <option value="">الوصول إلى</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="عادي">عادي</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <button className="btn" onClick={searchTrips} disabled={loading} style={{ marginTop: '15px', width: '100%' }}>
            {loading ? '⏳ جاري البحث...' : 'عرض الرحلات'}
          </button>
          {message && <p style={{ marginTop: '15px', color: 'red', textAlign: 'center' }}>{message}</p>}
        </div>
      )}

      {step === 'results' && (
        <div>
          <h2 style={{ color: '#0e5e4c', marginBottom: '20px' }}>🚌 رحلات {form.from} → {form.to} ({form.date})</h2>
          {trips.length === 0 ? (
            <div className="card" style={{ textAlign: 'center' }}>😔 لا توجد رحلات في هذا التاريخ.</div>
          ) : (
            trips.map(trip => (
              <div key={trip.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{trip.from_city} → {trip.to_city}</div>
                  <div>📅 {trip.date} | ⏰ {trip.time}</div>
                  <div style={{ color: '#0e5e4c', fontWeight: 'bold', marginTop: '5px' }}>
                    {trip.price} ريال
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

      {step === 'booking' && selectedTrip && (
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ color: '#0e5e4c' }}>👤 بيانات المسافر</h2>
          <input placeholder="الاسم الكامل" value={passenger.name} onChange={e => setPassenger({...passenger, name: e.target.value})} />
          <input placeholder="رقم الجوال (9665xxxxxxxx)" value={passenger.phone} onChange={e => setPassenger({...passenger, phone: e.target.value})} />
          <select value={passenger.seats} onChange={e => setPassenger({...passenger, seats: e.target.value})}>
            {[1,2,3,4,5,6].map(i => <option key={i} value={i}>{i} مقعد</option>)}
          </select>
          <div style={{ background: '#f0f8f4', padding: '15px', borderRadius: '10px', marginTop: '15px' }}>
            <p><strong>الرحلة:</strong> {selectedTrip.from_city} → {selectedTrip.to_city}</p>
            <p><strong>التاريخ:</strong> {selectedTrip.date} | <strong>الوقت:</strong> {selectedTrip.time}</p>
            <p><strong>الإجمالي التقريبي:</strong> {selectedTrip.price * parseInt(passenger.seats)} ريال</p>
          </div>
          <button className="btn" onClick={confirmBooking} style={{ width: '100%', marginTop: '20px' }}>
            🎫 تأكيد الحجز
          </button>
          {message && <p style={{ marginTop: '15px', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
        </div>
      )}

      {step === 'confirm' && (
        <div className="card" style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
          <h2>🎉 شكراً لك!</h2>
          <p>{message}</p>
          <button className="btn" onClick={() => { setStep('search'); setTrips([]); setPassenger({ name: '', phone: '', seats: '1' }) }}>
            حجز جديد
          </button>
        </div>
      )}
    </Layout>
  )
}

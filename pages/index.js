import { useState } from 'react'

const CITIES = [
  'الدمام', 'الرياض', 'المدينة المنورة', 'جده', 'مكه', 'جيزان', 'شرورة',
  'صنعاء', 'الحديدة', 'ذمار', 'البيضاء', 'المكلا', 'عدن', 'تعز المدينة', 'تعز الحوبان', 'إب'
]

const INITIAL_TRIPS = [
  { id: 1, from_city: 'الرياض', to_city: 'صنعاء', date: '2026-07-03', time: '11:00', price: 500, seats: 30, vip_seats: 10 },
  { id: 2, from_city: 'جده', to_city: 'عدن', date: '2026-07-04', time: '11:00', price: 450, seats: 25, vip_seats: 8 },
  { id: 3, from_city: 'الدمام', to_city: 'الحديدة', date: '2026-07-05', time: '11:00', price: 550, seats: 28, vip_seats: 12 },
  { id: 4, from_city: 'صنعاء', to_city: 'الرياض', date: '2026-07-03', time: '11:00', price: 500, seats: 30, vip_seats: 10 },
  { id: 5, from_city: 'الرياض', to_city: 'إب', date: '2026-07-06', time: '11:00', price: 480, seats: 22, vip_seats: 6 },
]

export default function Home() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [step, setStep] = useState('search') // search | results | booking | confirm
  const [form, setForm] = useState({ from: '', to: '', date: '', type: 'عادي' })
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [passenger, setPassenger] = useState({ name: '', phone: '', seats: '1' })

  function handleSearch() {
    if (!form.from || !form.to || !form.date) {
      setMessage('يرجى ملء جميع الحقول')
      return
    }
    setLoading(true)
    setMessage('')
    
    // بحث في الرحلات المحلية (ويمكن استبداله بـ API لاحقاً)
    setTimeout(() => {
      const results = INITIAL_TRIPS.filter(t => 
        t.from_city === form.from && 
        t.to_city === form.to && 
        t.date === form.date
      )
      setTrips(results)
      setStep('results')
      setLoading(false)
    }, 500)
  }

  function handleBook() {
    const bookingId = 'BK' + Date.now()
    setMessage(`🎉 تم الحجز بنجاح! رقم الحجز: ${bookingId}. سنتواصل معك قريباً.`)
    setStep('confirm')
  }

  return (
    <div style={{ fontFamily: 'Cairo, Tahoma, sans-serif', background: 'white', minHeight: '100vh', direction: 'rtl' }}>
      {/* هيدر */}
      <header style={{ background: '#0e5e4c', color: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>🚌 البركة للنقل</h1>
        <span style={{ fontSize: '14px' }}>ALBARAKA</span>
      </header>

      <div style={{ maxWidth: '650px', margin: '30px auto', padding: '0 15px' }}>
        {/* محرك البحث */}
        {step === 'search' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 15px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' }}>
            <h2 style={{ color: '#0e5e4c', marginBottom: '15px' }}>🔍 اختر رحلتك</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <select value={form.from} onChange={e => setForm({...form, from: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option value="">المغادرة من</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={form.to} onChange={e => setForm({...form, to: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option value="">الوصول إلى</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option value="عادي">عادي</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <button onClick={handleSearch} disabled={loading} style={{ width: '100%', padding: '12px', marginTop: '15px', background: '#0e5e4c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px' }}>
              {loading ? '⏳ جاري البحث...' : '🔍 عرض الرحلات'}
            </button>
            {message && <p style={{ marginTop: '10px', color: 'red', textAlign: 'center' }}>{message}</p>}
          </div>
        )}

        {/* نتائج البحث */}
        {step === 'results' && (
          <div>
            <h2 style={{ color: '#0e5e4c' }}>🚌 رحلات {form.from} → {form.to}</h2>
            {trips.length === 0 ? (
              <p style={{ textAlign: 'center', marginTop: '20px' }}>😔 لا توجد رحلات</p>
            ) : (
              trips.map(trip => (
                <div key={trip.id} style={{ background: 'white', borderRadius: '10px', padding: '15px', marginBottom: '10px', border: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{trip.from_city} → {trip.to_city}</div>
                    <div>📅 {trip.date} | ⏰ {trip.time}</div>
                    <div style={{ color: '#0e5e4c', fontWeight: 'bold' }}>{trip.price} ريال</div>
                  </div>
                  <button onClick={() => { setSelectedTrip(trip); setStep('booking') }} style={{ padding: '10px 20px', background: '#0e5e4c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    احجز الآن
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* بيانات المسافر */}
        {step === 'booking' && selectedTrip && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e0e0e0' }}>
            <h2 style={{ color: '#0e5e4c' }}>👤 بيانات المسافر</h2>
            <input placeholder="الاسم الكامل" value={passenger.name} onChange={e => setPassenger({...passenger, name: e.target.value})} style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input placeholder="رقم الجوال" value={passenger.phone} onChange={e => setPassenger({...passenger, phone: e.target.value})} style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd' }} />
            <select value={passenger.seats} onChange={e => setPassenger({...passenger, seats: e.target.value})} style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd' }}>
              {[1,2,3,4,5,6].map(i => <option key={i} value={i}>{i} مقعد</option>)}
            </select>
            <div style={{ background: '#f0f8f4', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
              <p><strong>الرحلة:</strong> {selectedTrip.from_city} → {selectedTrip.to_city}</p>
              <p><strong>التاريخ:</strong> {selectedTrip.date} | ⏰ {selectedTrip.time}</p>
              <p><strong>الإجمالي التقريبي:</strong> {selectedTrip.price * parseInt(passenger.seats)} ريال</p>
            </div>
            <button onClick={handleBook} style={{ width: '100%', padding: '12px', marginTop: '15px', background: '#0e5e4c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px' }}>
              🎫 تأكيد الحجز
            </button>
          </div>
        )}

        {/* تأكيد */}
        {step === 'confirm' && (
          <div style={{ textAlign: 'center', background: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #e0e0e0' }}>
            <h2>🎉 شكراً لك!</h2>
            <p>{message}</p>
            <button onClick={() => { setStep('search'); setTrips([]); setPassenger({ name: '', phone: '', seats: '1' }) }} style={{ padding: '10px 20px', marginTop: '15px', background: '#0e5e4c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              حجز جديد
            </button>
          </div>
        )}
      </div>

      <footer style={{ textAlign: 'center', padding: '20px', color: '#888', marginTop: '40px' }}>
        © 2026 البركة للنقل الجماعي | 📞 966566480912
      </footer>
    </div>
  )
}

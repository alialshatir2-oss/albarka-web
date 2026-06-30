import { useState } from 'react'

export default function Home() {
  const [step, setStep] = useState(1)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: '',
    passengers: '1',
    type: 'عادي',
    name: '',
    phone: '',
    tripId: '',
    trip: null
  })
  const [message, setMessage] = useState('')

  const cities = ['الدمام', 'جده', 'إب', 'صنعاء', 'تعز', 'المكلا', 'الحديدة']

  async function searchTrips() {
    if (!form.from || !form.to || !form.date) {
      setMessage('يرجى اختيار المدن والتاريخ')
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
      setStep(2)
    } catch (e) {
      setMessage('❌ خطأ في الاتصال بقاعدة البيانات')
    }
    setLoading(false)
  }

  async function handleBook() {
    setMessage('⏳ جاري إتمام حجزك...')
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          tripId: form.tripId,
          seats: form.passengers,
          type: form.type
        })
      })
      const data = await res.json()
      if (data.success) {
        setMessage(`🎉 تهانينا! تم حجز رحلتك بنجاح.
رقم الحجز: ${data.bookingId}
سنتواصل معك قريباً لتأكيد الدفع.`)
        setStep(5)
      } else {
        setMessage('❌ ' + (data.error || 'فشل الحجز. حاول مجدداً.'))
      }
    } catch (e) {
      setMessage('❌ خطأ في الاتصال. تأكد من اتصالك بالإنترنت.')
    }
  }

  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', background: '#f4f6f9', minHeight: '100vh', direction: 'rtl' }}>
      {/* الهيدر */}
      <header style={{ background: '#0e3b2e', color: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '22px' }}>🚌 البركة للنقل الجماعي</h1>
        <span style={{ fontWeight: 'bold' }}>ALBARAKA</span>
      </header>

      {/* شريط الخطوات */}
      <div style={{ background: 'white', padding: '15px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', boxShadow: '0 1px 5px rgba(0,0,0,0.05)' }}>
        {['🔍 بحث', '🚌 الرحلات', '👤 المسافر', '✅ تأكيد', '💳 الدفع'].map((s, i) => (
          <span key={i} style={{ padding: '10px 15px', background: step === i+1 ? '#0e3b2e' : '#e8edf2', color: step === i+1 ? 'white' : '#555', borderRadius: '25px', fontSize: '14px', fontWeight: step === i+1 ? 'bold' : 'normal' }}>{s}</span>
        ))}
      </div>

      <main style={{ maxWidth: '750px', margin: '30px auto', padding: '0 15px' }}>

        {/* الخطوة 1: محرك البحث */}
        {step === 1 && (
          <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)' }}>
            <h2 style={{ color: '#0e3b2e', marginBottom: '20px' }}>🔍 ابحث عن رحلتك المثالية</h2>
            {/* نوع الرحلة */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => setForm({...form, type: 'عادي'})} style={{ flex: 1, padding: '12px', background: form.type === 'عادي' ? '#0e3b2e' : '#f0f0f0', color: form.type === 'عادي' ? 'white' : '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>🪑 عادي</button>
              <button onClick={() => setForm({...form, type: 'VIP'})} style={{ flex: 1, padding: '12px', background: form.type === 'VIP' ? '#0e3b2e' : '#f0f0f0', color: form.type === 'VIP' ? 'white' : '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>👑 VIP</button>
            </div>
            {/* المدن والتاريخ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <select value={form.from} onChange={e => setForm({...form, from: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option value="">المغادرة من</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={form.to} onChange={e => setForm({...form, to: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option value="">الوصول إلى</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px' }} />
            <button onClick={searchTrips} disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#ccc' : '#0e3b2e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? '⏳ جاري البحث...' : '🔍 عرض الرحلات'}
            </button>
            {message && <p style={{ marginTop: '15px', color: '#d32f2f', textAlign: 'center' }}>{message}</p>}
          </div>
        )}

        {/* الخطوة 2: عرض الرحلات */}
        {step === 2 && (
          <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)' }}>
            <h2 style={{ color: '#0e3b2e', marginBottom: '20px' }}>🚌 رحلات {form.from} → {form.to}</h2>
            {trips.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888' }}>😔 لا توجد رحلات في هذا التاريخ. جرب تاريخاً آخر.</p>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {trips.map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{t.from_city} → {t.to_city}</div>
                      <div style={{ color: '#666', fontSize: '14px' }}>📅 {t.date} | ⏰ {t.time}</div>
                      <div style={{ color: '#0e3b2e', fontWeight: 'bold', marginTop: '5px' }}>{t.price} ريال</div>
                    </div>
                    <button onClick={() => { setForm({...form, tripId: t.id, trip: t}); setStep(3); }} style={{ padding: '10px 20px', background: '#0e3b2e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                      اختيار ✈️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* الخطوة 3: بيانات المسافر */}
        {step === 3 && (
          <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)' }}>
            <h2 style={{ color: '#0e3b2e', marginBottom: '20px' }}>👤 بيانات المسافر</h2>
            <input placeholder="الاسم الكامل" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input placeholder="رقم الجوال (مثال: 966512345678)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd' }} />
            <button onClick={() => setStep(4)} disabled={!form.name || !form.phone} style={{ width: '100%', padding: '14px', marginTop: '15px', background: (!form.name || !form.phone) ? '#ccc' : '#0e3b2e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              متابعة للتأكيد ✅
            </button>
          </div>
        )}

        {/* الخطوة 4: تأكيد الحجز */}
        {step === 4 && form.trip && (
          <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)' }}>
            <h2 style={{ color: '#0e3b2e', marginBottom: '20px' }}>✅ ملخص الحجز</h2>
            <div style={{ background: '#f0f8f4', padding: '15px', borderRadius: '10px' }}>
              <p><strong>🚌 الرحلة:</strong> {form.trip.from_city} → {form.trip.to_city}</p>
              <p><strong>📅 التاريخ:</strong> {form.trip.date} | <strong>⏰</strong> {form.trip.time}</p>
              <p><strong>👤 المسافر:</strong> {form.name}</p>
              <p><strong>📱 الجوال:</strong> {form.phone}</p>
              <p><strong>💺 النوع:</strong> {form.type} | <strong>المقاعد:</strong> {form.passengers}</p>
              <p style={{ fontWeight: 'bold', color: '#0e3b2e', fontSize: '18px' }}>💰 الإجمالي: {form.type === 'VIP' ? Math.round(form.trip.price * 1.5) * form.passengers : form.trip.price * form.passengers} ريال</p>
            </div>
            <button onClick={handleBook} style={{ width: '100%', padding: '14px', marginTop: '20px', background: '#0e3b2e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              🎫 تأكيد الحجز وإرسال الطلب
            </button>
            {message && <p style={{ marginTop: '15px', textAlign: 'center', color: message.includes('❌') ? '#d32f2f' : '#0e3b2e' }}>{message}</p>}
          </div>
        )}

        {/* الخطوة 5: الدفع */}
        {step === 5 && (
          <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <h2 style={{ color: '#0e3b2e' }}>💳 إتمام الدفع</h2>
            <p style={{ margin: '20px 0' }}>{message || 'اختر طريقة الدفع المناسبة لك'}</p>
            <div style={{ display: 'grid', gap: '10px' }}>
              <button style={{ padding: '15px', background: '#0e3b2e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>💳 الدفع ببطاقة مدى</button>
              <button style={{ padding: '15px', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>🏦 تحويل بنكي</button>
              <button style={{ padding: '15px', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>💵 الدفع عند المندوب</button>
            </div>
          </div>
        )}

        <footer style={{ textAlign: 'center', padding: '30px 0', color: '#888', fontSize: '13px' }}>
          <p>© 2026 شركة البركة للنقل الجماعي. جميع الحقوق محفوظة.</p>
          <p>📞 خدمة العملاء: 966566480912</p>
        </footer>
      </main>
    </div>
  )
}

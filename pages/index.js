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
    tripId: ''
  })
  const [message, setMessage] = useState('')

  async function searchTrips() {
    setLoading(true)
    try {
      const res = await fetch('/api/trips')
      const data = await res.json()
      const filtered = data.filter(t => 
        (form.from ? t.from_city === form.from : true) &&
        (form.to ? t.to_city === form.to : true) &&
        (form.date ? t.date === form.date : true)
      )
      setTrips(filtered)
      setStep(2)
    } catch (e) {
      setMessage('خطأ في البحث')
    }
    setLoading(false)
  }

  async function handleBook() {
    setMessage('جاري الحجز...')
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
        setMessage(`✅ تم الحجز بنجاح! رقم الحجز: ${data.bookingId}. سنتواصل معك قريباً.`)
        setStep(5)
      } else {
        setMessage(data.error || 'فشل الحجز')
      }
    } catch (e) {
      setMessage('خطأ في الاتصال')
    }
  }

  const cities = ['الدمام', 'جده', 'إب', 'صنعاء', 'تعز', 'المكلا', 'الحديدة']

  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', background: '#f0f4f8', minHeight: '100vh' }}>
      {/* الهيدر */}
      <div style={{ background: '#0e3b2e', color: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>🚌 البركة للنقل الجماعي</h1>
        <span>ALBARAKA</span>
      </div>

      {/* شريط الخطوات */}
      <div style={{ background: 'white', padding: '15px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {['🔍 بحث', '🚌 الرحلات', '👤 المسافر', '✅ تأكيد', '💳 الدفع'].map((s, i) => (
          <span key={i} style={{ padding: '10px', background: step === i+1 ? '#0e3b2e' : '#e0e0e0', color: step === i+1 ? 'white' : '#333', borderRadius: '20px', fontSize: '14px' }}>{s}</span>
        ))}
      </div>

      <div style={{ maxWidth: '700px', margin: '20px auto', padding: '0 15px' }}>

        {/* الخطوة 1: البحث */}
        {step === 1 && (
          <div style={{ background: 'white', borderRadius: '10px', padding: '20px' }}>
            <h2 style={{ color: '#0e3b2e' }}>🔍 ابحث عن رحلتك</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button onClick={() => setForm({...form, type: 'عادي'})} style={{ flex: 1, padding: '10px', background: form.type === 'عادي' ? '#0e3b2e' : '#e0e0e0', color: form.type === 'عادي' ? 'white' : '#333', border: 'none', borderRadius: '5px' }}>عادي</button>
              <button onClick={() => setForm({...form, type: 'VIP'})} style={{ flex: 1, padding: '10px', background: form.type === 'VIP' ? '#0e3b2e' : '#e0e0e0', color: form.type === 'VIP' ? 'white' : '#333', border: 'none', borderRadius: '5px' }}>VIP</button>
            </div>
            <select value={form.from} onChange={e => setForm({...form, from: e.target.value})} style={{ width: '100%', padding: '12px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ddd' }}>
              <option value="">المغادرة من</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.to} onChange={e => setForm({...form, to: e.target.value})} style={{ width: '100%', padding: '12px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ddd' }}>
              <option value="">الوصول إلى</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={{ width: '100%', padding: '12px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ddd' }} />
            <button onClick={searchTrips} disabled={loading} style={{ width: '100%', padding: '12px', background: '#0e3b2e', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px', fontSize: '16px' }}>
              {loading ? 'جاري البحث...' : '🔍 بحث'}
            </button>
          </div>
        )}

        {/* الخطوة 2: عرض الرحلات */}
        {step === 2 && (
          <div style={{ background: 'white', borderRadius: '10px', padding: '20px' }}>
            <h2 style={{ color: '#0e3b2e' }}>🚌 الرحلات المتاحة</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0e3b2e', color: 'white' }}>
                    <th style={{ padding: '10px' }}>#</th>
                    <th style={{ padding: '10px' }}>المسار</th>
                    <th style={{ padding: '10px' }}>التاريخ</th>
                    <th style={{ padding: '10px' }}>الوقت</th>
                    <th style={{ padding: '10px' }}>السعر</th>
                    <th style={{ padding: '10px' }}>المقاعد</th>
                    <th style={{ padding: '10px' }}>اختيار</th>
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
                      <td style={{ padding: '10px' }}>
                        <button onClick={() => { setForm({...form, tripId: t.id}); setStep(3); }} style={{ padding: '5px 15px', background: '#0e3b2e', color: 'white', border: 'none', borderRadius: '5px' }}>اختيار</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* الخطوة 3: معلومات المسافر */}
        {step === 3 && (
          <div style={{ background: 'white', borderRadius: '10px', padding: '20px' }}>
            <h2 style={{ color: '#0e3b2e' }}>👤 معلومات المسافر</h2>
            <input placeholder="الاسم الكامل" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ddd' }} />
            <input placeholder="رقم الجوال (9665xxxxxxxx)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ddd' }} />
            <button onClick={() => setStep(4)} disabled={!form.name || !form.phone} style={{ width: '100%', padding: '12px', background: '#0e3b2e', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px' }}>متابعة</button>
          </div>
        )}

        {/* الخطوة 4: التأكيد */}
        {step === 4 && (
          <div style={{ background: 'white', borderRadius: '10px', padding: '20px' }}>
            <h2 style={{ color: '#0e3b2e' }}>✅ تأكيد الحجز</h2>
            <p>الاسم: {form.name}</p>
            <p>الجوال: {form.phone}</p>
            <p>الرحلة: {form.tripId}</p>
            <p>المقاعد: {form.passengers} ({form.type})</p>
            <button onClick={handleBook} style={{ width: '100%', padding: '12px', background: '#0e3b2e', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px' }}>تأكيد الحجز</button>
          </div>
        )}

        {/* الخطوة 5: الدفع */}
        {step === 5 && (
          <div style={{ background: 'white', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
            <h2 style={{ color: '#0e3b2e' }}>💳 الدفع</h2>
            <p>{message || 'اختر طريقة الدفع'}</p>
            <button style={{ padding: '10px 20px', margin: '5px', background: '#0e3b2e', color: 'white', border: 'none', borderRadius: '5px' }}>💳 مدى</button>
            <button style={{ padding: '10px 20px', margin: '5px', background: '#0e3b2e', color: 'white', border: 'none', borderRadius: '5px' }}>🏦 تحويل بنكي</button>
          </div>
        )}

        <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
          <p>© 2026 شركة البركة للنقل الجماعي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  )
}

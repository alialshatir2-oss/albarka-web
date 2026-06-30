import { useState } from 'react'

export default function AdminDashboard() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [trips, setTrips] = useState([
    { id: 1, from_city: 'الرياض', to_city: 'صنعاء', date: '2026-07-03', time: '11:00', price: 500, seats: 30, vip_seats: 10 },
    { id: 2, from_city: 'جده', to_city: 'عدن', date: '2026-07-04', time: '11:00', price: 450, seats: 25, vip_seats: 8 }
  ])
  const [newTrip, setNewTrip] = useState({ from_city: '', to_city: '', date: '', time: '11:00', price: '500', seats: '30', vip_seats: '10' })
  const [editingPrice, setEditingPrice] = useState(null)
  const [newPrice, setNewPrice] = useState('')

  function login() {
    if (password === 'albarka2026') setAuthenticated(true)
    else alert('كلمة المرور غير صحيحة')
  }

  function addTrip() {
    if (!newTrip.from_city || !newTrip.to_city || !newTrip.date) {
      alert('يرجى ملء جميع الحقول')
      return
    }
    const newId = trips.length > 0 ? Math.max(...trips.map(t => t.id)) + 1 : 1
    setTrips([...trips, { ...newTrip, id: newId, price: parseInt(newTrip.price), seats: parseInt(newTrip.seats), vip_seats: parseInt(newTrip.vip_seats), status: 'متاحة' }])
    setNewTrip({ from_city: '', to_city: '', date: '', time: '11:00', price: '500', seats: '30', vip_seats: '10' })
  }

  function updatePrice(id) {
    setTrips(trips.map(t => t.id === id ? { ...t, price: parseInt(newPrice) } : t))
    setEditingPrice(null)
    setNewPrice('')
  }

  function deleteTrip(id) {
    setTrips(trips.filter(t => t.id !== id))
  }

  if (!authenticated) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center', fontFamily: 'Cairo, Tahoma, sans-serif' }}>
        <h2>🔐 دخول المشرف</h2>
        <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} />
        <button onClick={login} style={{ width: '100%', padding: '12px', background: '#0e5e4c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px' }}>دخول</button>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'Cairo, Tahoma, sans-serif', maxWidth: '900px', margin: '30px auto', padding: '0 15px' }}>
      <h1 style={{ color: '#0e5e4c' }}>📊 لوحة التحكم</h1>

      {/* إضافة رحلة جديدة */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e0e0e0' }}>
        <h2 style={{ color: '#0e5e4c' }}>➕ إضافة رحلة جديدة</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <input placeholder="من" value={newTrip.from_city} onChange={e => setNewTrip({...newTrip, from_city: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input placeholder="إلى" value={newTrip.to_city} onChange={e => setNewTrip({...newTrip, to_city: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input type="date" value={newTrip.date} onChange={e => setNewTrip({...newTrip, date: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input type="time" value={newTrip.time} onChange={e => setNewTrip({...newTrip, time: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input type="number" placeholder="السعر" value={newTrip.price} onChange={e => setNewTrip({...newTrip, price: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input type="number" placeholder="مقاعد عادية" value={newTrip.seats} onChange={e => setNewTrip({...newTrip, seats: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input type="number" placeholder="مقاعد VIP" value={newTrip.vip_seats} onChange={e => setNewTrip({...newTrip, vip_seats: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
        </div>
        <button onClick={addTrip} style={{ marginTop: '15px', padding: '12px 24px', background: '#0e5e4c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>إضافة الرحلة</button>
      </div>

      {/* قائمة الرحلات */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
        <h2 style={{ color: '#0e5e4c' }}>🚌 الرحلات الحالية ({trips.length})</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#0e5e4c', color: 'white' }}>
                <th style={{ padding: '10px' }}>#</th>
                <th style={{ padding: '10px' }}>من</th>
                <th style={{ padding: '10px' }}>إلى</th>
                <th style={{ padding: '10px' }}>التاريخ</th>
                <th style={{ padding: '10px' }}>الوقت</th>
                <th style={{ padding: '10px' }}>السعر</th>
                <th style={{ padding: '10px' }}>مقاعد</th>
                <th style={{ padding: '10px' }}>VIP</th>
                <th style={{ padding: '10px' }}>تعديل</th>
                <th style={{ padding: '10px' }}>حذف</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{t.id}</td>
                  <td style={{ padding: '10px' }}>{t.from_city}</td>
                  <td style={{ padding: '10px' }}>{t.to_city}</td>
                  <td style={{ padding: '10px' }}>{t.date}</td>
                  <td style={{ padding: '10px' }}>{t.time}</td>
                  <td style={{ padding: '10px' }}>
                    {editingPrice === t.id ? (
                      <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} style={{ width: '80px', padding: '5px' }} />
                    ) : (
                      `${t.price} ريال`
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>{t.seats}</td>
                  <td style={{ padding: '10px' }}>{t.vip_seats}</td>
                  <td style={{ padding: '10px' }}>
                    {editingPrice === t.id ? (
                      <button onClick={() => updatePrice(t.id)} style={{ background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>حفظ</button>
                    ) : (
                      <button onClick={() => { setEditingPrice(t.id); setNewPrice(t.price) }} style={{ background: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>تعديل السعر</button>
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => deleteTrip(t.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

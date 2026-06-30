import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [trips, setTrips] = useState([])
  const [bookings, setBookings] = useState([])
  const [complaints, setComplaints] = useState([])
  const [newTrip, setNewTrip] = useState({ from_city: '', to_city: '', date: '', time: '11:00', price: '500', seats: '30', vip_seats: '10', status: 'متاحة' })
  const [editingPrice, setEditingPrice] = useState(null)
  const [newPrice, setNewPrice] = useState('')

  function login() {
    if (password === 'albarka2026') setAuthenticated(true)
    else alert('كلمة المرور غير صحيحة')
  }

  useEffect(() => {
    if (authenticated) { fetchTrips(); fetchBookings(); fetchComplaints() }
  }, [authenticated])

  async function fetchTrips() {
    const res = await fetch('/api/admin/trips')
    const data = await res.json()
    setTrips(data)
  }
  async function fetchBookings() {
    const res = await fetch('/api/admin/bookings')
    const data = await res.json()
    setBookings(data)
  }
  async function fetchComplaints() {
    const res = await fetch('/api/admin/complaints')
    const data = await res.json()
    setComplaints(data)
  }

  async function addTrip() {
    await fetch('/api/admin/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrip)
    })
    setNewTrip({ from_city: '', to_city: '', date: '', time: '11:00', price: '500', seats: '30', vip_seats: '10', status: 'متاحة' })
    fetchTrips()
  }

  async function updatePrice(id) {
    await fetch(`/api/admin/trips?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: parseInt(newPrice) })
    })
    setEditingPrice(null)
    setNewPrice('')
    fetchTrips()
  }

  async function deleteTrip(id) {
    await fetch(`/api/admin/trips?id=${id}`, { method: 'DELETE' })
    fetchTrips()
  }

  if (!authenticated) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center', fontFamily: 'Cairo' }}>
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
          <input placeholder="من" value={newTrip.from_city} onChange={e => setNewTrip({...newTrip, from_city: e.target.value})} />
          <input placeholder="إلى" value={newTrip.to_city} onChange={e => setNewTrip({...newTrip, to_city: e.target.value})} />
          <input type="date" value={newTrip.date} onChange={e => setNewTrip({...newTrip, date: e.target.value})} />
          <input type="time" value={newTrip.time} onChange={e => setNewTrip({...newTrip, time: e.target.value})} />
          <input type="number" placeholder="السعر" value={newTrip.price} onChange={e => setNewTrip({...newTrip, price: e.target.value})} />
          <input type="number" placeholder="مقاعد عادية" value={newTrip.seats} onChange={e => setNewTrip({...newTrip, seats: e.target.value})} />
          <input type="number" placeholder="مقاعد VIP" value={newTrip.vip_seats} onChange={e => setNewTrip({...newTrip, vip_seats: e.target.value})} />
        </div>
        <button onClick={addTrip} style={{ marginTop: '10px', padding: '10px 20px', background: '#0e5e4c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>إضافة الرحلة</button>
      </div>

      {/* قائمة الرحلات مع تعديل السعر */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e0e0e0' }}>
        <h2 style={{ color: '#0e5e4c' }}>🚌 الرحلات الحالية ({trips.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0e5e4c', color: 'white' }}>
              <th>#</th><th>من</th><th>إلى</th><th>التاريخ</th><th>الوقت</th><th>السعر</th><th>مقاعد</th><th>VIP</th><th>تعديل</th><th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {trips.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{t.id}</td><td>{t.from_city}</td><td>{t.to_city}</td><td>{t.date}</td><td>{t.time}</td>
                <td>
                  {editingPrice === t.id ? (
                    <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} style={{ width: '80px' }} />
                  ) : (
                    `${t.price} ريال`
                  )}
                </td>
                <td>{t.seats}</td><td>{t.vip_seats}</td>
                <td>
                  {editingPrice === t.id ? (
                    <button onClick={() => updatePrice(t.id)} style={{ background: 'green', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>حفظ</button>
                  ) : (
                    <button onClick={() => { setEditingPrice(t.id); setNewPrice(t.price) }} style={{ background: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>تعديل السعر</button>
                  )}
                </td>
                <td>
                  <button onClick={() => deleteTrip(t.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* الحجوزات */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
        <h2 style={{ color: '#0e5e4c' }}>🎫 الحجوزات ({bookings.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0e5e4c', color: 'white' }}>
              <th>رقم الحجز</th><th>العميل</th><th>المسار</th><th>التاريخ</th><th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.booking_id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{b.booking_id}</td><td>{b.customer_name}</td><td>{b.from_city} → {b.to_city}</td><td>{b.date}</td><td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

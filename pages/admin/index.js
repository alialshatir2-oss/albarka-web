import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ trips: 0, bookings: 0, complaints: 0 })
  const [bookings, setBookings] = useState([])
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  function login() {
    if (password === 'albarka2026') setAuthenticated(true) // كلمة مرور بسيطة للدخول
    else alert('كلمة المرور غير صحيحة')
  }

  useEffect(() => {
    if (authenticated) {
      fetchData()
    }
  }, [authenticated])

  async function fetchData() {
    // هنا يمكن جلب الإحصائيات من Supabase
    setStats({ trips: 12, bookings: 5, complaints: 2 })
    setBookings([
      { id: 'BK123', customer_name: 'محمد', from_city: 'الرياض', to_city: 'صنعاء', date: '2026-07-03', status: 'مؤكد' },
      { id: 'BK124', customer_name: 'علي', from_city: 'جده', to_city: 'عدن', date: '2026-07-04', status: 'مؤكد' }
    ])
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
    <div style={{ fontFamily: 'Cairo, Tahoma, sans-serif', maxWidth: '800px', margin: '30px auto', padding: '0 15px' }}>
      <h1 style={{ color: '#0e5e4c' }}>📊 لوحة التحكم</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', margin: '20px 0' }}>
        <div style={{ background: '#0e5e4c', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h2>{stats.trips}</h2>
          <p>🚌 رحلات</p>
        </div>
        <div style={{ background: '#f39c12', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h2>{stats.bookings}</h2>
          <p>🎫 حجوزات</p>
        </div>
        <div style={{ background: '#e74c3c', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h2>{stats.complaints}</h2>
          <p>📝 شكاوى</p>
        </div>
      </div>

      <h2 style={{ color: '#0e5e4c' }}>آخر الحجوزات</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#0e5e4c', color: 'white' }}>
            <th style={{ padding: '10px' }}>رقم الحجز</th>
            <th style={{ padding: '10px' }}>العميل</th>
            <th style={{ padding: '10px' }}>المسار</th>
            <th style={{ padding: '10px' }}>التاريخ</th>
            <th style={{ padding: '10px' }}>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{b.id}</td>
              <td style={{ padding: '10px' }}>{b.customer_name}</td>
              <td style={{ padding: '10px' }}>{b.from_city} → {b.to_city}</td>
              <td style={{ padding: '10px' }}>{b.date}</td>
              <td style={{ padding: '10px' }}>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '30px' }}>
        <Link href="/" style={{ color: '#0e5e4c' }}>⬅️ العودة للموقع</Link>
      </div>
    </div>
  )
}

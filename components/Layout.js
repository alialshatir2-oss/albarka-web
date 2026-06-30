import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Layout({ children, showBack = false }) {
  const router = useRouter()

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link href="/" style={{ fontWeight: 'bold', fontSize: '20px', color: '#0e5e4c', textDecoration: 'none' }}>
            🚌 البركة للنقل
          </Link>
          <div>
            <Link href="/">الرئيسية</Link>
            <Link href="/track">تتبع الحجز</Link>
            <Link href="/contact">اتصل بنا</Link>
          </div>
        </div>
      </nav>

      <div className="container" style={{ marginTop: '30px', marginBottom: '30px', minHeight: '60vh' }}>
        {showBack && (
          <button onClick={() => router.back()} className="back-btn">
            ⬅️ رجوع
          </button>
        )}
        {children}
      </div>

      <footer style={{ textAlign: 'center', padding: '30px', background: '#1e293b', color: '#cbd5e1', marginTop: '40px' }}>
        © 2026 البركة للنقل الجماعي. جميع الحقوق محفوظة.
        <br/>📞 966566480912
      </footer>
    </>
  )
}

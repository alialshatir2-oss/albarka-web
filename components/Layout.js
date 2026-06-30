import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Layout({ children, showBack = false, activeStep = 0 }) {
  const router = useRouter()
  const steps = ['🔍 البحث', '🚌 الرحلات', '👤 البيانات', '✅ تأكيد']

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '22px', color: '#0e5e4c', textDecoration: 'none' }}>
            <span>🚌</span> البركة
          </Link>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/">الرئيسية</Link>
            <Link href="/track">تتبع الحجز</Link>
            <Link href="/contact">اتصل بنا</Link>
          </div>
        </div>
      </nav>

      <div className="container" style={{ marginTop: '40px', marginBottom: '40px', minHeight: '60vh' }}>
        {showBack && (
          <button onClick={() => router.back()} className="back-btn">
            ⬅️ رجوع
          </button>
        )}
        {activeStep > 0 && (
          <div className="steps">
            {steps.map((s, i) => (
              <span key={i} className={`step ${i + 1 === activeStep ? 'active' : ''}`}>{s}</span>
            ))}
          </div>
        )}
        {children}
      </div>

      <footer>
        <div className="container">
          <p style={{ fontWeight: 'bold', color: '#0e5e4c', marginBottom: '5px' }}>🚌 البركة للنقل الجماعي</p>
          <p>© 2026 جميع الحقوق محفوظة | 📞 966566480912</p>
        </div>
      </footer>
    </>
  )
}

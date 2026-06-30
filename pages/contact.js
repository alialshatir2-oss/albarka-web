import Layout from '../components/Layout'

export default function Contact() {
  return (
    <Layout showBack>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#0e5e4c' }}>📞 اتصل بنا</h2>
        <p style={{ marginTop: '20px' }}>نحن هنا لخدمتك على مدار الساعة</p>
        <p>📱 واتساب: 966566480912</p>
        <p>📧 البريد: info@albarka.sa</p>
      </div>
    </Layout>
  )
}

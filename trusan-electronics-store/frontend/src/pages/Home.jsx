export default function Home({ onShop }) {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <section style={{ padding: 24, background: '#fff', borderRadius: 18, boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)' }}>
        <h1 style={{ marginTop: 0 }}>Shop the latest electronics at Trusan</h1>
        <p style={{ fontSize: 18, lineHeight: 1.7 }}>
          Discover premium phones, laptops, TVs, fridges, audio systems, and accessories with real prices and product images.
          Add items to the cart, sign in as a customer, and complete checkout with a secure order flow.
        </p>
        <button onClick={onShop} style={{ marginTop: 16, padding: '14px 22px', fontSize: 16, borderRadius: 10, background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Start Shopping
        </button>
      </section>
      <section style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div style={{ padding: 20, borderRadius: 16, background: '#fff', border: '1px solid #e5e7eb' }}>
          <h2>Phones</h2>
          <p>High-performance mobile phones with modern cameras, long battery life, and fast 5G connectivity.</p>
        </div>
        <div style={{ padding: 20, borderRadius: 16, background: '#fff', border: '1px solid #e5e7eb' }}>
          <h2>Laptops</h2>
          <p>Work, stream, and create with powerful laptops built for productivity and entertainment.</p>
        </div>
        <div style={{ padding: 20, borderRadius: 16, background: '#fff', border: '1px solid #e5e7eb' }}>
          <h2>TVs & Home</h2>
          <p>Ultra-HD TVs, smart displays, and kitchen appliances to upgrade your living space.</p>
        </div>
      </section>
    </div>
  );
}

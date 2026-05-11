export default function Navbar({ currentPage, onNavigate, cartCount, user, onSignOut }) {
  const links = [
    { key: 'home', label: 'Home' },
    { key: 'products', label: 'Products' },
    { key: 'cart', label: `Cart (${cartCount})` },
    { key: 'checkout', label: 'Checkout' }
  ];

  // Add user-specific links
  if (user) {
    links.push({ key: 'orders', label: 'My Orders' });
    links.push({ key: 'feedback', label: 'My Feedback' });

    // Admin link only for admin users
    if (user.role === 'admin') {
      links.push({ key: 'admin', label: 'Admin' });
    }
  }

  return (
    <header style={{ background: '#1f2937', color: '#fff', padding: '18px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20 }}>Trusan Electronics</h1>
          <p style={{ margin: '4px 0 0', color: '#cbd5e1' }}>Phones, laptops, TVs, fridges,</p>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {links.map((link) => (
            <button
              key={link.key}
              onClick={() => onNavigate(link.key)}
              style={{
                padding: '10px 14px',
                border: 'none',
                borderRadius: 8,
                background: currentPage === link.key ? '#4f46e5' : '#374151',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              {link.label}
            </button>
          ))}
          {user ? (
            <button
              onClick={onSignOut}
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #9ca3af', background: 'transparent', color: '#fff', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => onNavigate('signin')}
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #9ca3af', background: 'transparent', color: '#fff', cursor: 'pointer' }}
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

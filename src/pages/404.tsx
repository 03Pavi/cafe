import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: 'var(--color-cream)', color: 'var(--color-espresso)', fontFamily: 'Poppins, sans-serif' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>404 - Page Not Found</h2>
      <p style={{ opacity: 0.8 }}>Could not find the requested page.</p>
      <Link href="/" className="button button--primary" style={{ marginTop: '20px', textDecoration: 'none' }}>
        Return Home
      </Link>
    </div>
  );
}

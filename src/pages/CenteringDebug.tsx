export function CenteringDebug() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '28rem', width: '100%', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>Centering Debug</h1>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ height: '8rem', background: 'linear-gradient(to right, #3b82f6, #6366f1)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: '700', fontSize: '1.25rem' }}>Should Be Centered</span>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ height: '4rem', backgroundColor: '#ef4444', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: '500' }}>Left</span>
              </div>
              <div style={{ height: '4rem', backgroundColor: '#10b981', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: '500' }}>Center</span>
              </div>
              <div style={{ height: '4rem', backgroundColor: '#3b82f6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: '500' }}>Right</span>
              </div>
            </div>
            
            <p style={{ color: '#4b5563' }}>
              This content should be perfectly centered both vertically and horizontally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
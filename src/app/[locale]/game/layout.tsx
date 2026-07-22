export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: 0, padding: 0, overflow: 'hidden', background: '#0a0a1a', height: '100vh', width: '100vw' }}>
      {children}
    </div>
  );
}

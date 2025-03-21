export function Body({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: '1px solid #e4e4e7',
        margin: '1rem 1rem 1rem 255px',
        borderRadius: '1rem',
        backgroundColor: '#fff',
        height: 'calc(100vh - 2rem)',
        boxShadow: '0 1px 3px 0 rgba(0,0,0,.2),0 1px 2px -1px rgba(0,0,0,.2)',
      }}
    >
      <div
        className="flex h-12 items-center gap-2 px-4 font-semibold"
        style={{ borderBottom: '1px solid #e4e4e7' }}
      >
        Dashboard
      </div>
      <div>{children}</div>
    </div>
  );
}

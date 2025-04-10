export const metadata = {
  title: "Reflection Journal",
  description: "Mint your daily reflection as an on-chain ritual of care",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{
        fontFamily: 'Georgia, serif',
        background: 'linear-gradient(180deg, #F9FAFB 0%, #ECFDF5 100%)',
        color: '#333',
        padding: '2rem',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <main style={{
          background: '#FFFFFF',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
          width: '100%',
          maxWidth: '600px'
        }}>
          {children}
        </main>
      </body>
    </html>
  );
}

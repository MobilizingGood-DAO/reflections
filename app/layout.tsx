export const metadata = {
  title: "Reflection Journal",
  description: "Mint your daily reflection as an on-chain ritual of care",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', backgroundColor: '#f7f7f7', padding: '2rem' }}>
        {children}
      </body>
    </html>
  );
}

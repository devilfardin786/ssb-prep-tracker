import './globals.css';

export const metadata = {
  title: 'SSB 90-Day Command Center',
  description: 'SSB Preparation Tracker for Fardin & Mukul',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
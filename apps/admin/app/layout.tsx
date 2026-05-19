import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { AdminAuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'CeylonTrails Admin',
  description: 'Admin panel for CeylonTrails',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AdminAuthProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: 'rgba(15,23,42,0.95)',
                color: '#fff',
                borderRadius: '12px',
                fontWeight: 500,
              },
            }}
          />
        </AdminAuthProvider>
      </body>
    </html>
  );
}

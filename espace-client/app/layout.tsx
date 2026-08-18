import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Espace client — Launch48',
  description: 'Suivi de production et brief de projet.',
  icons: { icon: '/favicon-fusee.svg' },
  // Par défaut on n'indexe rien de cette app : ni /espace/*, ni /admin.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: '#091019',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Sora:wght@700;800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

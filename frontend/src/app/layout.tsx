// src/app/layout.tsx
import '../globals.css'; // ✅ only if `globals.css` is directly in `src/`

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orchid Cloner',
  description: 'Clone websites with style!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

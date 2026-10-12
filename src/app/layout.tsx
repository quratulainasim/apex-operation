import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LayoutShell } from '@/components/layout-shell';

export const metadata: Metadata = {
  title: 'Apex Operations | Governed workflow orchestration',
  description:
    'Turn business requests into governed, auditable workflows with deterministic execution, human approval gates, and evidence by default.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F9F8F6' },
    { media: '(prefers-color-scheme: dark)', color: '#5A4A42' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="antialiased" suppressHydrationWarning>
        <LayoutShell>{children}</LayoutShell>
        <Toaster />
      </body>
    </html>
  );
}

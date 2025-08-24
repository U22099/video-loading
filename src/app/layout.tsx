import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Setting Things Up...',
  description: "We're designing your lighting setup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

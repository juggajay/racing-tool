import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Horse Racing Website',
  description: 'A website for horse racing enthusiasts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
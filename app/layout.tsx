import type { Metadata } from 'next';
import '../public/styles/globals.css';

export const metadata: Metadata = {
  title: 'Year 8 Dooren Syllabus',
  description: 'Interactive learning platform for Year 8 Dooren syllabus',
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

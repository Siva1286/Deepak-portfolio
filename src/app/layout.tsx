import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Poppins } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Deepak P | AI & Data Science Student | Aspiring Data Analyst',
  description: 'Turning Data into Decisions. Building Intelligent Solutions. B.Tech Artificial Intelligence and Data Science student passionate about Data Analytics, Machine Learning, and Full Stack Development.',
  keywords: [
    'Deepak P',
    'AI & Data Science Student',
    'Data Analyst',
    'Python Developer',
    'Full Stack Developer',
    'Machine Learning',
    'Portfolio',
    'Erode',
    'Tamil Nadu'
  ],
  authors: [{ name: 'Deepak P' }],
  creator: 'Deepak P',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://github.com/Siva1286',
    title: 'Deepak P | AI & Data Science Student | Aspiring Data Analyst',
    description: 'Turning Data into Decisions. Building Intelligent Solutions.',
    siteName: 'Deepak P Portfolio',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${spaceGrotesk.variable} ${poppins.variable} scroll-smooth`}
    >
      <body className="bg-background text-white antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

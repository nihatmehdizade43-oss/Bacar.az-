/* ============================================
   Bacar.az — Root Layout
   ============================================ */
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthSessionProvider from '@/components/providers/SessionProvider';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AiChat from '@/components/ui/AiChat';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bacar.az'),
  title: 'BACAR.AZ — Azərbaycanın İlk Gənc Rəqəmsal Ekosistemi',
  description: 'Bacarığını göstər, iş tap, böyü. AI ilə portfolio yarat, freelance iş tap, mentorlarla əlaqə qur. Azərbaycanın ilk gənc rəqəmsal ekosistemi.',
  keywords: 'freelance, portfolio, azerbaycan, bacar, iş tap, AI portfolio, gənclər, rəqəmsal',
  authors: [{ name: 'BACAR.AZ' }],
  openGraph: {
    title: 'BACAR.AZ — Azərbaycanın İlk Gənc Rəqəmsal Ekosistemi',
    description: 'Bacarığını göstər, iş tap, böyü.',
    type: 'website',
    locale: 'az_AZ',
    url: '/',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="az" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter antialiased`}>
        <ThemeProvider>
          <AuthSessionProvider>
            <AuthProvider>
              <ToastProvider>
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1 pt-20">
                    {children}
                  </main>
                  <Footer />
                  <AiChat />
                </div>
              </ToastProvider>
            </AuthProvider>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

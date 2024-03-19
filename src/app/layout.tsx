import CustomSessionProvider from '@/client/providers/CustomSessionProvider';
import QueryProvider from '@/client/providers/QueryProvider';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Inversio',
  description: 'Tenha controle sobre seus trades com a Invesio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <CustomSessionProvider>
        <QueryProvider>
          <body className={inter.className}>
            <main>{children}</main>
            <Toaster />
          </body>
        </QueryProvider>
      </CustomSessionProvider>
    </html>
  );
}

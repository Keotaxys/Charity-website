import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Navbar from '@/components/Navbar'; 
import "../globals.css";

export default async function LocaleLayout({
  children,
  params // 1. ຮັບຄ່າ params ມາແບບເຕັມໆ
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // 2. ປ່ຽນ Type ໃຫ້ເປັນ Promise
}) {
  // 3. ໃຊ້ await ເພື່ອດຶງຄ່າ locale ອອກມາ (Next.js 15 ບັງຄັບໃຫ້ເຮັດແບບນີ້)
  const { locale } = await params;

  // ໂຫຼດຄຳແປ (messages)
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased bg-white text-gray-900">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Noto_Sans_Lao } from 'next/font/google'; // <-- 1. Import Font ເຂົ້າມາ
import Navbar from '@/components/Navbar'; 
import "../globals.css";

// 2. ຕັ້ງຄ່າ Font Noto Sans Lao
const notoSansLao = Noto_Sans_Lao({
  subsets: ['lao'],
  weight: ['400', '500', '600', '700'], // ຮອງຮັບຄວາມໜາຫຼາຍລະດັບ ເພື່ອຄວາມສວຍງາມໃນການອອກແບບ
  variable: '--font-noto-lao', // ສ້າງ CSS Variable ໄວ້ໃຫ້ Tailwind ເອີ້ນໃຊ້
  display: 'swap',
});

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // ໂຫຼດຄຳແປ (messages)
  const messages = await getMessages();

  return (
    // 3. ເອົາຕົວປ່ຽນ Font (notoSansLao.variable) ມາໃສ່ໃນ Tag html
    <html lang={locale} className={notoSansLao.variable}>
      
      {/* 4. ເພີ່ມ font-sans ໃສ່ໃນ body ເພື່ອໃຫ້ທຸກຂໍ້ຄວາມໃນເວັບໃຊ້ Font ນີ້ເປັນຫຼັກ */}
      <body className="antialiased bg-white text-gray-900 font-sans">
        
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
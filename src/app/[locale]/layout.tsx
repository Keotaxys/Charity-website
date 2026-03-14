import type { Metadata } from 'next';
import { Noto_Sans_Lao } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Import Components ຫຼັກທີ່ຕ້ອງມີທຸກໜ້າ
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import '../globals.css';

// ຕັ້ງຄ່າ Font ພາສາລາວ
const notoSansLao = Noto_Sans_Lao({ 
  subsets: ['lao'], 
  weight: ['400', '500', '700', '900'] 
});

export const metadata: Metadata = {
  title: 'BEAST.LAO - Charity Website',
  description: 'Hope is built through action.',
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // ດຶງຂໍ້ຄວາມແປພາສາ (Translations)
  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      {/* ໃຊ້ flex flex-col ແລະ min-h-screen ທີ່ body ເພື່ອຈັດການໂຄງສ້າງໜ້າເວັບ */}
      <body className={`${notoSansLao.className} flex flex-col min-h-screen bg-white`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          
          {/* ແຖບເມນູດ້ານເທິງ */}
          <Navbar />
          
          {/* ເນື້ອຫາຫຼັກຂອງແຕ່ລະໜ້າ: ໃຊ້ flex-grow ເພື່ອຍູ້ Footer ລົງລຸ່ມສຸດສະເໝີ */}
          <main className="flex-grow pt-20">
            {children}
          </main>

          {/* ແຖບຂໍ້ມູນດ້ານລຸ່ມ */}
          <Footer />

        </NextIntlClientProvider>
      </body>
    </html>
  );
}
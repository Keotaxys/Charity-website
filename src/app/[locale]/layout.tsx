import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Navbar from '@/components/Navbar'; // <-- ເພີ່ມການ Import Navbar ບ່ອນນີ້
import "./../globals.css";

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // ໂຫຼດຄຳແປ (messages) ຕາມພາສາທີ່ຢູ່ໃນ URL
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased bg-white text-gray-900">
        <NextIntlClientProvider messages={messages}>
          
          {/* ແຖບເມນູດ້ານເທິງ */}
          <Navbar />
          
          {/* ສ່ວນເນື້ອຫາຫຼັກຂອງເວັບໄຊ້ (ຍູ້ລົງມາໜ້ອຍໜຶ່ງດ້ວຍ pt-16 ເພື່ອບໍ່ໃຫ້ຊ້ອນທັບກັບ Navbar) */}
          <main className="min-h-screen pt-16">
            {children}
          </main>
          
          {/* ສ່ວນ Footer ສາມາດມາໃສ່ບ່ອນນີ້ໄດ້ໃນອະນາຄົດ */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
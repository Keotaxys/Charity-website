import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
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
          {/* ສ່ວນ Header/Navbar ສາມາດມາໃສ່ບ່ອນນີ້ໄດ້ໃນອະນາຄົດ */}
          <main className="min-h-screen">
            {children}
          </main>
          {/* ສ່ວນ Footer ສາມາດມາໃສ່ບ່ອນນີ້ໄດ້ */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
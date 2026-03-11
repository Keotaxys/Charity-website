import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['lo', 'en'];

export default getRequestConfig(async ({ locale }) => {
  // ສ້າງຕົວປ່ຽນໃໝ່: ຖ້າ locale ເປັນ undefined ໃຫ້ໃຊ້ 'lo' ແທນອັດຕະໂນມັດ
  const currentLocale = locale || 'lo';

  // ກວດສອບວ່າພາສາທີ່ໄດ້ມາ ຢູ່ໃນລາຍຊື່ທີ່ເຮົາຮອງຮັບຫຼືບໍ່
  if (!locales.includes(currentLocale)) notFound();

  return {
    locale: currentLocale, // ຕອນນີ້ TypeScript ຮູ້ແລ້ວວ່າມັນເປັນ string ແນ່ນອນ 100%
    messages: (await import(`../messages/${currentLocale}.json`)).default
  };
});
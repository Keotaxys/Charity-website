import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// ກຳນົດພາສາທັງໝົດທີ່ເວັບໄຊ້ເຮົາຮອງຮັບ
const locales = ['lo', 'en'];

export default getRequestConfig(async ({ locale }) => {
  // ຖ້າຜູ້ໃຊ້ພິມ URL ເປັນພາສາອື່ນທີ່ເຮົາບໍ່ມີ (ເຊັ່ນ: /fr, /th) ໃຫ້ສະແດງໜ້າ 404 Not Found
  if (!locales.includes(locale as any)) notFound();

  return {
    // ໂຫຼດໄຟລ໌ຄຳແປຈາກໂຟນເດີ messages ຕາມພາສາທີ່ຜູ້ໃຊ້ກຳລັງເບິ່ງຢູ່
    // ໃຊ້ `../` ເພາະໄຟລ໌ນີ້ຢູ່ໃນ src/ ແຕ່ messages ຢູ່ຂ້າງນອກ
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
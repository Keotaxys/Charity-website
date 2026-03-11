import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // ກຳນົດພາສາທັງໝົດທີ່ຮອງຮັບ (ຕ້ອງກົງກັບໃນ i18n.ts)
  locales: ['lo', 'en'],

  // ກຳນົດພາສາເລີ່ມຕົ້ນ ເວລາຄົນເຂົ້າເວັບໄຊ້ຜ່ານ domain.com ແລ້ວໃຫ້ມັນໄປ /lo ທັນທີ
  defaultLocale: 'lo',

  // ຖ້າຕັ້ງເປັນ false, ພາສາເລີ່ມຕົ້ນ (lo) ກໍຈະມີ /lo ຢູ່ໜ້າ URL ຄືກັນ
  localePrefix: 'always' 
});

export const config = {
  // ກຳນົດວ່າຈະໃຫ້ Middleware ເຮັດວຽກຢູ່ໜ້າໃດແດ່
  // ບັນທັດນີ້ຈະບອກໃຫ້ລະບົບ "ຂ້າມ" ໄຟລ໌ static ຕ່າງໆ ເຊັ່ນ ຮູບພາບ ຫຼື favicon
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
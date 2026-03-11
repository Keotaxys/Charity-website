import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

// ສ້າງ Plugin ຂອງ next-intl (ມັນຈະໄປຊອກຫາໄຟລ໌ src/i18n.ts ອັດຕະໂນມັດ)
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  // ຖ້າມີການຕັ້ງຄ່າອື່ນໆໃນອະນາຄົດ ເຊັ່ນ: ການອະນຸຍາດລິ້ງຮູບພາບຈາກ Firebase ສາມາດມາໃສ່ບ່ອນນີ້ໄດ້
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

// ຫໍ່ nextConfig ດ້ວຍ withNextIntl
export default withNextIntl(nextConfig);
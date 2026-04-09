import { use } from 'react';
// 💡 Import ຕົວ Client Component ທີ່ເຮົາຫາກໍສ້າງມາໃຊ້
import CampaignClient from './CampaignClient';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

// 💡 ນີ້ຄື Server Component ທີ່ເຮັດໜ້າທີ່ຮັບ Promise ຢ່າງຖືກຕ້ອງຕາມກົດ Next.js 15
export default function CampaignDetailPage({ params }: Props) {
  // ໃຊ້ React.use() ແກະ Promise ຢ່າງປອດໄພເທິງ Server
  const resolvedParams = use(params);

  // ສົ່ງຄ່າທີ່ແກະແລ້ວ ໄປໃຫ້ Client Component ສະແດງຜົນ
  return <CampaignClient id={resolvedParams.id} locale={resolvedParams.locale} />;
}
'use client';

import { useEffect, useState, use } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

// ກຳນົດຮູບແບບຂອງ Page Props ໃຫ້ຊັດເຈນ ເພື່ອບໍ່ໃຫ້ Next.js ສັບສົນ
type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default function CampaignDetailPage({ params }: Props) {
  // ໃຊ້ React.use() ເພື່ອແກະຄ່າ Promise
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const id = resolvedParams.id;

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const docRef = doc(db, "campaigns", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCampaign({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-xl">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>;
  if (!campaign) return <div className="min-h-screen flex justify-center items-center font-bold text-xl">ບໍ່ພົບຂໍ້ມູນໂຄງການນີ້</div>;

  const percent = Math.min(Math.round((campaign.raised_amount / campaign.target_amount) * 100), 100);

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="w-full h-[50vh] md:h-[70vh] relative bg-gray-900">
        <img src={campaign.cover_image} alt="cover" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="mb-6">
            <Link href={`/${locale}/campaigns`} className="text-blue-600 font-bold hover:underline mb-4 inline-block">
              &larr; {locale === 'lo' ? 'ກັບຄືນໜ້າລວມໂຄງການ' : 'Back to Campaigns'}
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
            {locale === 'lo' ? campaign.title_lo : campaign.title_en}
          </h1>

          <div className="bg-gray-50 p-6 md:p-8 rounded-3xl mb-10 border border-gray-100">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
              <div>
                <p className="text-5xl font-black text-blue-600">{percent}%</p>
                <p className="text-gray-500 font-bold mt-1 uppercase tracking-wider">
                  {locale === 'lo' ? 'ຂອງເປົ້າໝາຍ' : 'Funded'}
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-3xl font-black text-gray-900">
                  {Number(campaign.raised_amount).toLocaleString()} <span className="text-xl text-gray-500">LAK</span>
                </p>
                <p className="text-gray-500 font-bold mt-1">
                  / {Number(campaign.target_amount).toLocaleString()} LAK
                </p>
              </div>
            </div>
            
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden mb-8">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
            </div>
            
            <button className="w-full bg-blue-600 text-white text-xl font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30 transform hover:-translate-y-1">
              {locale === 'lo' ? 'ຮ່ວມບໍລິຈາກດຽວນີ້' : 'DONATE NOW'}
            </button>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              {locale === 'lo' ? 'ກ່ຽວກັບໂຄງການນີ້' : 'About this Campaign'}
            </h3>
            <p className="whitespace-pre-line leading-relaxed text-lg">
              {locale === 'lo' ? campaign.description_lo : campaign.description_en}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
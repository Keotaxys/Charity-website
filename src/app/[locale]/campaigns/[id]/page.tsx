'use client';

import { useEffect, useState, use } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default function CampaignDetailPage({ params }: Props) {
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

  if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-xl text-teal-600">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>;
  if (!campaign) return <div className="min-h-screen flex justify-center items-center font-bold text-xl text-gray-500">ບໍ່ພົບຂໍ້ມູນໂຄງການນີ້</div>;

  const percent = Math.min(Math.round((campaign.raised_amount / campaign.target_amount) * 100), 100);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* 💡 1. ປັບຂະໜາດຄວາມສູງຂອງຮູບ (h-[40vh] md:h-[50vh]) ແລະ ປັບແຕ່ງການສະແດງຜົນ */}
      <div className="w-full h-[40vh] md:h-[50vh] relative bg-gray-900 overflow-hidden">
        <img 
          src={campaign.cover_image} 
          alt="cover" 
          className="w-full h-full object-cover object-center opacity-70" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
      </div>

      {/* 💡 ປັບໄລຍະຫ່າງ (margin-top) ໃຫ້ສົມດຸນກັບຮູບທີ່ນ້ອຍລົງ */}
      <div className="max-w-4xl mx-auto px-6 -mt-24 md:-mt-32 relative z-10">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          
          <div className="mb-6">
            <Link href={`/${locale}/campaigns`} className="text-teal-600 font-bold hover:text-teal-700 hover:underline mb-4 inline-flex items-center gap-2 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              {locale === 'lo' ? 'ກັບຄືນໜ້າລວມໂຄງການ' : 'Back to Campaigns'}
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-8 leading-tight">
            {locale === 'lo' ? campaign.title_lo : campaign.title_en}
          </h1>

          <div className="bg-gray-50 p-6 md:p-8 rounded-3xl mb-10 border border-gray-100">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
              <div>
                <p className="text-5xl font-black text-teal-600">{percent}%</p>
                <p className="text-gray-500 font-bold mt-1 uppercase tracking-wider text-sm">
                  {locale === 'lo' ? 'ຂອງເປົ້າໝາຍ' : 'Funded'}
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-3xl font-black text-gray-900">
                  {Number(campaign.raised_amount).toLocaleString()} <span className="text-xl text-gray-500">LAK</span>
                </p>
                <p className="text-gray-500 font-bold mt-1 text-sm">
                  {locale === 'lo' ? 'ເປົ້າໝາຍທັງໝົດ:' : 'Target:'} {Number(campaign.target_amount).toLocaleString()} LAK
                </p>
              </div>
            </div>
            
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden mb-8">
              <div className="h-full bg-teal-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div>
            </div>
            
            {/* 💡 2. ປ່ຽນປຸ່ມໃຫ້ເປັນ Link ໄປຫາໜ້າບໍລິຈາກ ພ້ອມສົ່ງ ID ໂຄງການໄປນຳ */}
            <Link 
              href={`/${locale}/donate?campaignId=${campaign.id}`}
              className="w-full flex items-center justify-center bg-teal-600 text-white text-lg md:text-xl font-black py-5 rounded-2xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-600/30 transform hover:-translate-y-1 tracking-widest uppercase"
            >
              {locale === 'lo' ? 'ຮ່ວມບໍລິຈາກດຽວນີ້' : 'DONATE NOW'}
            </Link>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <h3 className="text-2xl font-black mb-6 text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
              {locale === 'lo' ? 'ກ່ຽວກັບໂຄງການນີ້' : 'About this Campaign'}
            </h3>
            <p className="whitespace-pre-line leading-relaxed text-[17px] text-gray-600">
              {locale === 'lo' ? campaign.description_lo : campaign.description_en}
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
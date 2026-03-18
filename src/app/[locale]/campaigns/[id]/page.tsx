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

  if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-xl text-teal-600 bg-[#F8FAFC]">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>;
  if (!campaign) return <div className="min-h-screen flex justify-center items-center font-bold text-xl text-gray-500 bg-[#F8FAFC]">ບໍ່ພົບຂໍ້ມູນໂຄງການນີ້</div>;

  const percent = Math.min(Math.round((campaign.raised_amount / campaign.target_amount) * 100), 100);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24">
      {/* Hero Section: ປັບຄວາມສູງໃຫ້ພໍດີ ແລະ ໃສ່ Overlay ແບບ Gradient */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden bg-gray-900">
        <img 
          src={campaign.cover_image} 
          alt="cover" 
          className="w-full h-full object-cover object-center opacity-60 scale-105 transition-transform duration-700 hover:scale-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-black/20"></div>
      </div>

      {/* Main Content: ໃຊ້ Grid ແບ່ງ 2 ຖັນ (Left: Content, Right: Sticky Card) */}
      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ເບື້ອງຊ້າຍ: ເນື້ອຫາໂຄງການ (2 ສ່ວນ 3 ຂອງຄວາມກວ້າງ) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
              <Link href={`/${locale}/campaigns`} className="inline-flex items-center gap-2 text-teal-600 font-bold text-sm mb-6 hover:gap-3 transition-all uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                {locale === 'lo' ? 'ກັບຄືນ' : 'BACK'}
              </Link>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-8 leading-tight">
                {locale === 'lo' ? campaign.title_lo : campaign.title_en}
              </h1>

              <article className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                   <span className="w-1.5 h-6 bg-teal-500 rounded-full"></span>
                   {locale === 'lo' ? 'ກ່ຽວກັບໂຄງການ' : 'ABOUT THIS PROJECT'}
                </h3>
                <p className="whitespace-pre-line text-[17px]">
                  {locale === 'lo' ? campaign.description_lo : campaign.description_en}
                </p>
              </article>
            </div>
          </div>

          {/* ເບື້ອງຂວາ: ບັດບໍລິຈາກ (Sticky Card - 1 ສ່ວນ 3 ຂອງຄວາມກວ້າງ) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-teal-900/5 border border-teal-50 lg:sticky lg:top-24">
              <div className="space-y-6">
                
                {/* ແຖບເປີເຊັນ */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-5xl font-black text-teal-600 tracking-tighter">{percent}%</span>
                    <span className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{locale === 'lo' ? 'ສຳເລັດແລ້ວ' : 'REACHED'}</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>

                {/* ຂໍ້ມູນຍອດເງິນ */}
                <div className="pt-4 border-t border-gray-50 space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">{locale === 'lo' ? 'ຍອດບໍລິຈາກປັດຈຸບັນ' : 'Total Raised'}</span>
                    <span className="font-black text-gray-900 text-2xl">{Number(campaign.raised_amount).toLocaleString()} LAK</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">{locale === 'lo' ? 'ເປົ້າໝາຍທັງໝົດ' : 'Goal Amount'}</span>
                    <span className="font-bold text-gray-500 text-lg">{Number(campaign.target_amount).toLocaleString()} LAK</span>
                  </div>
                </div>

                {/* ປຸ່ມບໍລິຈາກ */}
                <div className="pt-4">
                  <Link 
                    href={`/${locale}/donate?campaignId=${campaign.id}`}
                    className="flex items-center justify-center w-full bg-teal-600 hover:bg-teal-700 text-white text-center font-black py-5 rounded-2xl transition-all shadow-lg shadow-teal-600/20 hover:-translate-y-1 uppercase tracking-[0.2em] text-lg"
                  >
                    {locale === 'lo' ? 'ຮ່ວມບໍລິຈາກ' : 'DONATE NOW'}
                  </Link>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
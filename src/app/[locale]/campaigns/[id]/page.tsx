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
    <div className="bg-[#F8FAFC] min-h-screen pb-24 font-sans">
      
      {/* Header Section: ປັບຄວາມສູງໃຫ້ສົມສ່ວນ ແລະ ໃຊ້ object-top */}
      <div className="relative w-full h-[35vh] md:h-[45vh] overflow-hidden bg-gray-200">
        <img 
          src={campaign.cover_image} 
          alt="cover" 
          // 💡 ຈຸດສຳຄັນ: ໃຊ້ object-top ເພື່ອເນັ້ນສ່ວນເທິງຂອງຮູບ (ປ້ອງກັນຫົວຄົນຫາຍ)
          className="w-full h-full object-cover object-top opacity-90 transition-transform duration-1000" 
        />
        {/* Overlay: ປັບໃຫ້ Gradient ນຸ້ມນວນຂຶ້ນເພື່ອໃຫ້ຂໍ້ມູນເບື້ອງລຸ່ມອ່ານງ່າຍ */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-black/10"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 md:-mt-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* ເບື້ອງຊ້າຍ: ເນື້ອຫາຫຼັກ */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
              <Link href={`/${locale}/campaigns`} className="inline-flex items-center gap-2 text-teal-600 font-bold text-sm mb-6 hover:gap-3 transition-all uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                {locale === 'lo' ? 'ກັບຄືນ' : 'BACK'}
              </Link>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-8 leading-tight">
                {locale === 'lo' ? campaign.title_lo : campaign.title_en}
              </h1>

              <div className="w-16 h-1.5 bg-teal-500 rounded-full mb-8"></div>

              <article className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tight">
                   {locale === 'lo' ? 'ລາຍລະອຽດໂຄງການ' : 'PROJECT DETAILS'}
                </h3>
                <p className="whitespace-pre-line text-lg leading-relaxed">
                  {locale === 'lo' ? campaign.description_lo : campaign.description_en}
                </p>
              </article>
            </div>
          </div>

          {/* ເບື້ອງຂວາ: ບັດບໍລິຈາກ (Sticky) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-teal-900/5 border border-teal-50">
              <div className="space-y-8">
                
                {/* ຄວາມຄືບໜ້າ */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <div className="flex flex-col">
                        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">{locale === 'lo' ? 'ຄວາມຄືບໜ້າ' : 'PROGRESS'}</span>
                        <span className="text-5xl font-black text-teal-600 tracking-tighter leading-none mt-1">{percent}%</span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>

                {/* ຕົວເລກຍອດເງິນ */}
                <div className="space-y-5 pt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{locale === 'lo' ? 'ຍອດບໍລິຈາກປັດຈຸບັນ' : 'AMOUNT RAISED'}</span>
                    <div className="flex items-baseline gap-1">
                        <span className="font-black text-gray-900 text-3xl">{Number(campaign.raised_amount).toLocaleString()}</span>
                        <span className="text-gray-400 font-bold text-sm">LAK</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 border-t border-gray-50 pt-5">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{locale === 'lo' ? 'ເປົ້າໝາຍທັງໝົດ' : 'TOTAL GOAL'}</span>
                    <div className="flex items-baseline gap-1">
                        <span className="font-bold text-gray-500 text-xl">{Number(campaign.target_amount).toLocaleString()}</span>
                        <span className="text-gray-400 font-medium text-xs">LAK</span>
                    </div>
                  </div>
                </div>

                {/* ປຸ່ມບໍລິຈາກ */}
                <div className="pt-2">
                  <Link 
                    href={`/${locale}/donate?campaignId=${campaign.id}`}
                    className="flex items-center justify-center w-full bg-teal-600 hover:bg-teal-700 text-white text-center font-black py-5 rounded-2xl transition-all shadow-lg shadow-teal-600/20 hover:-translate-y-1 active:scale-95 uppercase tracking-[0.2em] text-sm"
                  >
                    {locale === 'lo' ? 'ຮ່ວມບໍລິຈາກ' : 'DONATE NOW'}
                  </Link>
                </div>

              </div>
            </div>
            
            {/* ເພີ່ມຄວາມໝັ້ນໃຈໃຫ້ຜູ້ບໍລິຈາກ */}
            <p className="mt-6 text-center text-gray-400 text-xs font-medium px-4">
               {locale === 'lo' 
                ? 'ທຸກໆການບໍລິຈາກຈະຖືກບັນທຶກ ແລະ ສາມາດກວດສອບໄດ້ 100% ເພື່ອຄວາມໂປ່ງໃສ.' 
                : 'All donations are recorded and 100% verifiable for full transparency.'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
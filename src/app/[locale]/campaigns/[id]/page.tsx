'use client';

import { useEffect, useState, use } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
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

  // --- ຕົວປ່ຽນສຳລັບ Pop-up ຜູ້ບໍລິຈາກ ---
  const [showAllDonorsModal, setShowAllDonorsModal] = useState(false);
  const [allDonors, setAllDonors] = useState<any[]>([]);
  const [loadingDonors, setLoadingDonors] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const docRef = doc(db, "campaigns", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCampaign({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  // --- ຟັງຊັນດຶງຂໍ້ມູນຜູ້ບໍລິຈາກທັງໝົດຂອງໂຄງການນີ້ ---
  const handleViewAllDonors = async () => {
    setShowAllDonorsModal(true);
    setLoadingDonors(true);
    try {
      const q = query(
        collection(db, 'donations'),
        where('campaignId', '==', id),
        orderBy('amount', 'desc')
      );
      const snap = await getDocs(q);
      const donorsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllDonors(donorsData);
    } catch (error) {
      console.error("Error fetching all donors:", error);
    } finally {
      setLoadingDonors(false);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-xl text-teal-600 bg-white">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>;
  if (!campaign) return <div className="min-h-screen flex justify-center items-center font-bold text-xl text-gray-500 bg-white">ບໍ່ພົບຂໍ້ມູນໂຄງການນີ້</div>;

  const percent = Math.min(Math.round((campaign.raised_amount / campaign.target_amount) * 100), 100);

  return (
    <div className="bg-white min-h-screen pb-24 font-sans relative">

      {/* 1. Header Navigation */}
      <div className="max-w-6xl mx-auto px-6 pt-10 md:pt-16">
        <Link href={`/${locale}/campaigns`} className="inline-flex items-center gap-2 text-teal-600 font-bold text-sm mb-6 hover:text-teal-700 transition-all uppercase tracking-widest">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          {locale === 'lo' ? 'ກັບຄືນໜ້າໂຄງການ' : 'BACK TO PROJECTS'}
        </Link>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-10 leading-tight max-w-4xl">
          {locale === 'lo' ? campaign.title_lo : campaign.title_en}
        </h1>
      </div>

      {/* 2. Main Content Grid */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* --- ເບື້ອງຊ້າຍ (8/12): ຮູບພາບ ແລະ ລາຍລະອຽດ --- */}
          <div className="lg:col-span-8 space-y-10">
            <div className="w-full bg-gray-50 rounded-[2.5rem] overflow-hidden shadow-md border border-gray-100 flex items-center justify-center p-2">
              <img
                src={campaign.cover_image}
                alt="cover"
                className="w-full max-h-[450px] object-contain rounded-[2rem]"
              />
            </div>

            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-teal-500 rounded-full"></span>
                {locale === 'lo' ? 'ກ່ຽວກັບໂຄງການນີ້' : 'ABOUT THIS CAMPAIGN'}
              </h3>
              <p className="whitespace-pre-line text-lg leading-relaxed text-gray-600">
                {locale === 'lo' ? campaign.description_lo : campaign.description_en}
              </p>
            </div>
          </div>

          {/* --- ເບື້ອງຂວາ (4/12): ບັດຄວາມຄືບໜ້າ (Sticky) --- */}
          <div className="lg:col-span-4 lg:sticky lg:top-10">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-teal-900/10 border border-teal-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 space-y-8">

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <div className="flex flex-col">
                      <span className="text-teal-600 font-black text-5xl tracking-tighter">{percent}%</span>
                      <span className="text-gray-400 font-bold text-xs md:text-sm uppercase tracking-wider mt-1">
                        {locale === 'lo' ? 'ສຳເລັດແລ້ວ' : 'REACHED'}
                      </span>
                    </div>
                  </div>
                  <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-1000 ease-out shadow-inner"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Amount Details */}
                <div className="space-y-6 pt-2">
                  <div className="flex flex-col">
                    <span className="text-gray-500 font-bold uppercase tracking-wider text-xs md:text-sm mb-1">
                      {locale === 'lo' ? 'ຍອດບໍລິຈາກປັດຈຸບັນ' : 'CURRENTLY RAISED'}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-black text-gray-900 text-3xl">{Number(campaign.raised_amount).toLocaleString()}</span>
                      <span className="text-gray-400 font-bold text-sm">LAK</span>
                    </div>
                  </div>

                  <div className="flex flex-col border-t border-gray-100 pt-6">
                    <span className="text-gray-500 font-bold uppercase tracking-wider text-xs md:text-sm mb-1">
                      {locale === 'lo' ? 'ເປົ້າໝາຍທັງໝົດ' : 'TOTAL GOAL'}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-gray-500 text-xl">{Number(campaign.target_amount).toLocaleString()}</span>
                      <span className="text-gray-400 font-medium text-xs">LAK</span>
                    </div>
                  </div>
                </div>

                {/* Buttons Action */}
                <div className="pt-4 space-y-3">
                  <Link
                    href={`/${locale}/donate?campaignId=${campaign.id}`}
                    className="flex items-center justify-center w-full bg-teal-600 hover:bg-teal-700 text-white text-center font-black py-6 rounded-3xl transition-all shadow-xl shadow-teal-600/20 hover:-translate-y-1 active:scale-95 uppercase tracking-wider text-lg"
                  >
                    {locale === 'lo' ? 'ຮ່ວມບໍລິຈາກ' : 'DONATE NOW'}
                  </Link>

                  {/* ປຸ່ມເບິ່ງຜູ້ບໍລິຈາກທັງໝົດ */}
                  <button
                    onClick={handleViewAllDonors}
                    className="w-full py-3 bg-teal-50 text-teal-700 font-bold rounded-2xl hover:bg-teal-100 transition-all uppercase tracking-wider text-sm border border-teal-100"
                  >
                    {locale === 'lo' ? 'ເບິ່ງຜູ້ບໍລິຈາກທັງໝົດ' : 'VIEW ALL DONORS'}
                  </button>
                </div>

                <p className="text-center text-gray-400 text-xs md:text-sm font-bold leading-relaxed px-4">
                  {locale === 'lo'
                    ? 'ຂໍ້ມູນການບໍລິຈາກຂອງທ່ານຈະຖືກບັນທຶກຢ່າງໂປ່ງໃສ'
                    : 'YOUR CONTRIBUTION IS SECURE AND TRANSPARENT'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. Pop-up (Modal) ສຳລັບສະແດງລາຍຊື່ຜູ້ບໍລິຈາກທັງໝົດ --- */}
      {showAllDonorsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">

            {/* ສ່ວນຫົວ Pop-up */}
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-black text-gray-900">
                {locale === 'lo' ? 'ຜູ້ສະໜັບສະໜູນທັງໝົດ' : 'ALL SUPPORTERS'}
              </h3>
              <button onClick={() => setShowAllDonorsModal(false)} className="text-gray-400 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* ສ່ວນເນື້ອຫາລາຍຊື່ (ເລື່ອນຂຶ້ນລົງໄດ້) */}
            <div className="p-6 overflow-y-auto flex-1">
              {loadingDonors ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium">{locale === 'lo' ? 'ກຳລັງໂຫຼດຂໍ້ມູນ...' : 'Loading...'}</p>
                </div>
              ) : allDonors.length > 0 ? (
                <div className="space-y-3">
                  {allDonors.map((donor, index) => (
                    <div key={donor.id} className="flex justify-between items-center p-4 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center bg-teal-50 text-teal-700 rounded-full font-black text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{donor.name || (locale === 'lo' ? 'ຜູ້ບໍ່ປະສົງອອກນາມ' : 'Anonymous')}</p>
                        </div>
                      </div>
                      <div className="font-black text-teal-600 text-lg">
                        {Number(donor.amount).toLocaleString()} <span className="text-sm font-bold text-gray-400">LAK</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                  </div>
                  <p className="text-gray-500 font-medium">
                    {locale === 'lo' ? 'ຍັງບໍ່ມີຂໍ້ມູນຜູ້ບໍລິຈາກສຳລັບໂຄງການນີ້' : 'No donors yet for this campaign.'}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
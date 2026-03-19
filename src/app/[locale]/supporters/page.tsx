'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, where } from 'firebase/firestore';

// 💡 ກຳນົດອັດຕາແລກປ່ຽນລາຍວັນ (ສາມາດປ່ຽນແປງໄດ້ຕາມຈິງ)
const EXCHANGE_RATE_USD_TO_LAK = 22000;

// ຟັງຊັນກຳນົດ Theme ສີຕາມອັນດັບ (1=Teal, 2=Pink, 3+=Gray)
const getRankTheme = (index: number) => {
  if (index === 0) return { text: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' };
  if (index === 1) return { text: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200' };
  return { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
};

export default function SupportersPage() {
  const locale = useLocale();

  const [pageSettings, setPageSettings] = useState<any>(null);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [topDonors, setTopDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'settings', 'supporters_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setPageSettings(docSnap.data());

        const sponsorsQuery = query(collection(db, 'sponsors'), orderBy('order_index', 'asc'));
        const sponsorsSnap = await getDocs(sponsorsQuery);
        setSponsors(sponsorsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const donationsQuery = query(collection(db, 'donations'), where('status', '==', 'Approved'));
        const donationsSnap = await getDocs(donationsQuery);
        
        const donorTotals: Record<string, { name: string, totalBaseLAK: number, hideAmount: boolean, profileUrl: string }> = {};
        
        donationsSnap.forEach((doc) => {
          const data = doc.data();
          if (data.hideName) return; 

          const name = data.donor_name?.trim() || 'Anonymous';
          const amount = Number(data.amount) || 0;
          const currency = data.currency || 'LAK';

          // ຄຳນວນທຸກຍອດໃຫ້ເປັນ LAK ເພື່ອໃຊ້ຈັດອັນດັບ ແລະ ສະແດງຜົນຫຼັກ
          const baseLAK = currency === 'USD' ? amount * EXCHANGE_RATE_USD_TO_LAK : amount;
          
          if (donorTotals[name]) {
            donorTotals[name].totalBaseLAK += baseLAK;
            if (data.hideAmount) donorTotals[name].hideAmount = true;
            if (!donorTotals[name].profileUrl && !data.hideProfile && data.profile_url) {
              donorTotals[name].profileUrl = data.profile_url;
            }
          } else {
            donorTotals[name] = { 
              name, 
              totalBaseLAK: baseLAK, 
              hideAmount: data.hideAmount || false, 
              profileUrl: (!data.hideProfile && data.profile_url) ? data.profile_url : ''
            };
          }
        });

        const sortedTopDonors = Object.values(donorTotals)
          .sort((a, b) => b.totalBaseLAK - a.totalBaseLAK)
          .slice(0, 5);

        setTopDonors(sortedTopDonors);

      } catch (error) {
        console.error("Error fetching supporters data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const platinumSponsors = sponsors.filter(s => s.type === 'platinum');
  const generalSponsors = sponsors.filter(s => s.type === 'general');

  const headerTitle = pageSettings ? (locale === 'lo' ? pageSettings.header_title_lo : pageSettings.header_title_en) : '';
  const headerSubtitle = pageSettings ? (locale === 'lo' ? pageSettings.header_subtitle_lo : pageSettings.header_subtitle_en) : '';
  const ctaTitle = pageSettings ? (locale === 'lo' ? pageSettings.cta_title_lo : pageSettings.cta_title_en) : '';
  const ctaBtn = pageSettings ? (locale === 'lo' ? pageSettings.cta_btn_lo : pageSettings.cta_btn_en) : 'BECOME A PARTNER';

  if (loading) {
    return <div className="min-h-screen flex flex-col items-center justify-center"><div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div><p className="mt-4 text-teal-600 font-bold">ກຳລັງໂຫຼດຂໍ້ມູນ...</p></div>;
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24 font-sans relative">
      
      {/* 1. ສ່ວນຫົວ (Header) */}
      <section className="bg-white py-16 px-6 border-b border-gray-100 relative overflow-hidden z-10">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-widest uppercase">
            {headerTitle}
          </h1>
          <p className="text-sm md:text-base text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            {headerSubtitle}
          </p>
        </div>
      </section>

      {/* 2. Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ຝັ່ງຊ້າຍ (8/12): ໂລໂກ້ຜູ້ສະໜັບສະໜູນຕ່າງໆ */}
          <div className="lg:col-span-8 space-y-20 order-2 lg:order-1">
            
            {/* Platinum Sponsors */}
            <section>
              <div className="mb-10 flex items-center gap-4">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                  {locale === 'lo' ? 'ຜູ້ສະໜັບສະໜູນລະດັບແພລັດຕິນຳ' : 'PLATINUM PARTNERS'}
                </h2>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              
              {platinumSponsors.length === 0 ? (
                 <p className="text-gray-400 text-sm font-medium">ຍັງບໍ່ມີຜູ້ສະໜັບສະໜູນລະດັບນີ້</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {platinumSponsors.map((sponsor) => (
                    <div key={sponsor.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex items-center justify-center group h-48">
                      <img src={sponsor.logo_url} alt={sponsor.name} className="w-full max-w-[180px] h-auto max-h-[100px] object-contain grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* General Sponsors */}
            <section>
              <div className="mb-10 flex items-center gap-4">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                  {locale === 'lo' ? 'ພາກສ່ວນທີ່ໃຫ້ການສະໜັບສະໜູນ' : 'GENERAL PARTNERS'}
                </h2>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              
              {generalSponsors.length === 0 ? (
                <p className="text-gray-400 text-sm font-medium">ຍັງບໍ່ມີຜູ້ສະໜັບສະໜູນລະດັບນີ້</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {generalSponsors.map((sponsor) => (
                    <div key={sponsor.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center group h-32 hover:border-teal-200 transition-colors">
                      <img src={sponsor.logo_url} alt={sponsor.name} className="w-full max-w-[120px] h-auto max-h-[60px] object-contain opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ຝັ່ງຂວາ (4/12): Ranking Top 5 */}
          <div className="lg:col-span-4 lg:sticky lg:top-10 order-1 lg:order-2 mb-10 lg:mb-0">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              
              <div className="text-center mb-8">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-3">
                  {locale === 'lo' ? 'ທຳນຽບ 5 ອັນດັບສູງສຸດ' : 'TOP 5 DONORS'}
                </h2>
                <div className="w-12 h-1 bg-teal-600 rounded-full mx-auto"></div>
              </div>

              {topDonors.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-10">ບໍ່ມີຂໍ້ມູນ</p>
              ) : (
                <div className="space-y-4">
                  {topDonors.map((donor, index) => {
                    const theme = getRankTheme(index);
                    
                    // 💡 ຄຳນວນ BaseLAK ກັບໄປເປັນ USD ສຳລັບສະແດງໃນວົງເລັບ
                    const usdEquivalent = donor.totalBaseLAK / EXCHANGE_RATE_USD_TO_LAK;

                    return (
                      <div 
                        key={index} 
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${theme.bg} ${theme.border} hover:scale-[1.02]`}
                      >
                        <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-xs border bg-white ${theme.text} ${theme.border}`}>
                          {index + 1}
                        </div>
                        
                        <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-white border border-gray-200 flex items-center justify-center text-sm font-black text-gray-400">
                          {donor.profileUrl ? (
                            <img src={donor.profileUrl} alt={donor.name} className="w-full h-full object-cover" />
                          ) : (
                            donor.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold text-sm truncate uppercase tracking-wide ${theme.text}`}>
                            {donor.name}
                          </h3>
                        </div>
                        
                        {/* 💡 ສະແດງ LAK ເປັນຫຼັກ ແລະ (USD) ຢູ່ລຸ່ມ */}
                        <div className="text-right shrink-0">
                          {!donor.hideAmount && donor.totalBaseLAK > 0 ? (
                            <div className="flex flex-col items-end leading-tight gap-0.5">
                              {/* ຍອດເງິນຫຼັກເປັນກີບ */}
                              <p className={`font-black text-base sm:text-lg ${theme.text}`}>
                                {donor.totalBaseLAK.toLocaleString()} <span className="text-[10px] font-bold uppercase opacity-70">LAK</span>
                              </p>
                              {/* ຍອດທຽບເທົ່າເປັນໂດລາໃນວົງເລັບ */}
                              <p className={`text-[11px] font-bold opacity-60 ${theme.text}`}>
                                (${usdEquivalent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                              </p>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {locale === 'lo' ? 'ບໍ່ເປີດເຜີຍ' : 'HIDDEN'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3. ສ່ວນ Call to Action */}
      <section className="bg-white border-t border-gray-100 py-20 px-6 mt-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 uppercase tracking-widest">
            {ctaTitle}
          </h2>
          <Link 
            href={`/${locale}/about/contact`} 
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-full transition-all shadow-md hover:shadow-teal-600/30 uppercase tracking-[0.2em] text-sm"
          >
            {ctaBtn}
          </Link>
        </div>
      </section>

    </div>
  );
}
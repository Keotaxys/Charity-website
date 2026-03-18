'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, limit, where } from 'firebase/firestore';

// 💡 ກຳນົດອັດຕາແລກປ່ຽນ (ສາມາດປ່ຽນແປງໄດ້ຕາມຈິງ)
const EXCHANGE_RATE_USD_TO_LAK = 22000;

export default function SupportersPage() {
  const locale = useLocale();

  const [pageSettings, setPageSettings] = useState<any>(null);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [topDonors, setTopDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. ດຶງຂໍ້ມູນການຕັ້ງຄ່າໜ້າ
        const docRef = doc(db, 'settings', 'supporters_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setPageSettings(docSnap.data());

        // 2. ດຶງລາຍຊື່ຜູ້ສະໜັບສະໜູນທັງໝົດສຳລັບ Logo
        const sponsorsQuery = query(collection(db, 'sponsors'), orderBy('order_index', 'asc'));
        const sponsorsSnap = await getDocs(sponsorsQuery);
        setSponsors(sponsorsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // 3. ດຶງຂໍ້ມູນການບໍລິຈາກທີ່ອະນຸມັດແລ້ວເພື່ອມາຈັດ Top 5 Ranking
        const donationsQuery = query(
          collection(db, 'donations'),
          where('status', '==', 'Approved')
        );
        const donationsSnap = await getDocs(donationsQuery);
        
        // ຈັດກຸ່ມ (Group) ຍອດບໍລິຈາກຕາມຊື່
        const donorTotals: Record<string, { 
          name: string, 
          totalBaseLAK: number, 
          totalLAK: number, 
          totalUSD: number, 
          hideAmount: boolean, 
          profileUrl: string 
        }> = {};
        
        donationsSnap.forEach((doc) => {
          const data = doc.data();
          
          if (data.hideName) return; 

          const name = data.donor_name?.trim() || 'Anonymous';
          const amount = Number(data.amount) || 0;
          const currency = data.currency || 'LAK'; // ດຶງສະກຸນເງິນ

          // 💡 ຄຳນວນເງິນເຂົ້າເປັນ Base LAK ເພື່ອໃຊ້ໃນການຈັດອັນດັບ
          const baseLAK = currency === 'USD' ? amount * EXCHANGE_RATE_USD_TO_LAK : amount;
          
          if (donorTotals[name]) {
            donorTotals[name].totalBaseLAK += baseLAK;
            if (currency === 'USD') donorTotals[name].totalUSD += amount;
            else donorTotals[name].totalLAK += amount;

            if (data.hideAmount) donorTotals[name].hideAmount = true;
            // ຖ້າຍັງບໍ່ມີຮູບ ແລະ ໃບບິນນີ້ມີຮູບທີ່ບໍ່ໄດ້ເຊື່ອງ ໃຫ້ດຶງມາໃສ່
            if (!donorTotals[name].profileUrl && !data.hideProfile && data.profile_url) {
              donorTotals[name].profileUrl = data.profile_url;
            }
          } else {
            donorTotals[name] = { 
              name: name,
              totalBaseLAK: baseLAK,
              totalLAK: currency === 'LAK' ? amount : 0,
              totalUSD: currency === 'USD' ? amount : 0,
              hideAmount: data.hideAmount || false,
              profileUrl: (!data.hideProfile && data.profile_url) ? data.profile_url : ''
            };
          }
        });

        // 💡 ປ່ຽນ Object ເປັນ Array, ຈັດລຽງຈາກຫຼາຍຫາໜ້ອຍ ໂດຍໃຊ້ totalBaseLAK
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

  // ແຍກປະເພດໂລໂກ້
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
    <div className="bg-white min-h-screen pb-24 font-sans">
      
      {/* 1. ສ່ວນຫົວ (Header) */}
      <section className="bg-gray-100 py-20 px-6 border-b border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-400/15 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter uppercase drop-shadow-sm">
            {headerTitle}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {headerSubtitle}
          </p>
        </div>
      </section>

      {/* 2. Top 5 (Wall of Fame) */}
      {topDonors.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase mb-4">
              {locale === 'lo' ? 'ທຳນຽບ 5 ອັນດັບຜູ້ສະໜັບສະໜູນ' : 'TOP 5 WALL OF FAME'}
            </h2>
            <div className="w-20 h-1.5 bg-teal-600 rounded-full mx-auto"></div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-teal-900/5 border border-gray-100 overflow-hidden">
            {topDonors.map((donor, index) => {
              const isFirst = index === 0;

              let rankBadge = <span className="text-gray-400 font-black text-xl">#{index + 1}</span>;
              if (index === 0) rankBadge = <span className="text-3xl" title="Gold">🥇</span>;
              if (index === 1) rankBadge = <span className="text-3xl" title="Silver">🥈</span>;
              if (index === 2) rankBadge = <span className="text-3xl" title="Bronze">🥉</span>;

              return (
                <div 
                  key={index} 
                  className={`flex items-center p-6 sm:p-8 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    isFirst ? 'bg-gradient-to-r from-yellow-50/50 to-white' : ''
                  }`}
                >
                  <div className="w-12 sm:w-16 flex justify-center items-center shrink-0">
                    {rankBadge}
                  </div>
                  
                  {/* 💡 ສ່ວນຮູບໂປຣໄຟລ໌ ແລະ ຊື່ */}
                  <div className="flex-1 px-4 flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 shadow-sm flex items-center justify-center text-xl sm:text-2xl font-black text-teal-600">
                      {donor.profileUrl ? (
                        <img src={donor.profileUrl} alt={donor.name} className="w-full h-full object-cover" />
                      ) : (
                        // ຖ້າບໍ່ມີຮູບ ໃຫ້ສະແດງຕົວອັກສອນທຳອິດຂອງຊື່
                        donor.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <h3 className={`font-black sm:text-xl uppercase tracking-wider ${isFirst ? 'text-gray-900' : 'text-gray-700'}`}>
                      {donor.name}
                    </h3>
                  </div>
                  
                  {/* 💡 ສ່ວນສະແດງຍອດເງິນ (ສະແດງແຍກ LAK ແລະ USD ຖ້າມີ) */}
                  <div className="text-right shrink-0">
                    {!donor.hideAmount && donor.totalBaseLAK > 0 ? (
                      <div className="flex flex-col items-end gap-1">
                        {donor.totalLAK > 0 && (
                          <p className={`font-black tracking-wide ${isFirst ? 'text-teal-600 text-2xl sm:text-3xl' : 'text-teal-600 text-xl sm:text-2xl'}`}>
                            {donor.totalLAK.toLocaleString()} <span className="text-sm font-bold text-gray-400 uppercase">LAK</span>
                          </p>
                        )}
                        {donor.totalUSD > 0 && (
                          <p className={`font-black tracking-wide ${isFirst ? 'text-green-600 text-2xl sm:text-3xl' : 'text-green-600 text-xl sm:text-2xl'}`}>
                            ${donor.totalUSD.toLocaleString()} <span className="text-sm font-bold text-gray-400 uppercase">USD</span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="inline-block bg-gray-50 text-gray-400 font-bold text-xs sm:text-sm px-4 py-2 rounded-full border border-gray-100 uppercase tracking-widest">
                        {locale === 'lo' ? 'ບໍ່ເປີດເຜີຍຈຳນວນ' : 'UNDISCLOSED'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. ຜູ້ສະໜັບສະໜູນຫຼັກ (Platinum Sponsors) */}
      <section className="bg-gray-50 py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="inline-block px-6 py-2 bg-pink-50 text-pink-500 font-black rounded-full uppercase tracking-widest text-sm mb-4 border border-pink-100">
              {locale === 'lo' ? 'ຜູ້ສະໜັບສະໜູນລະດັບແພລັດຕິນຳ' : 'PLATINUM PARTNERS'}
            </h2>
          </div>
          
          {platinumSponsors.length === 0 ? (
             <p className="text-center text-gray-400 font-bold">ຍັງບໍ່ມີຜູ້ສະໜັບສະໜູນລະດັບນີ້</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {platinumSponsors.map((sponsor) => (
                <div key={sponsor.id} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex items-center justify-center group">
                  <img src={sponsor.logo_url} alt={sponsor.name} className="w-full max-w-sm h-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. ຜູ້ສະໜັບສະໜູນທົ່ວໄປ (General Partners) */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="inline-block px-6 py-2 bg-teal-50 text-teal-600 font-black rounded-full uppercase tracking-widest text-sm mb-4 border border-teal-100">
            {locale === 'lo' ? 'ພາກສ່ວນທີ່ໃຫ້ການສະໜັບສະໜູນ' : 'GENERAL PARTNERS'}
          </h2>
        </div>
        
        {generalSponsors.length === 0 ? (
          <p className="text-center text-gray-400 font-bold">ຍັງບໍ່ມີຜູ້ສະໜັບສະໜູນລະດັບນີ້</p>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {generalSponsors.map((sponsor) => (
              <div key={sponsor.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center group hover:border-teal-200 transition-colors">
                <img src={sponsor.logo_url} alt={sponsor.name} className="w-full max-w-[150px] h-auto object-contain opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. ສ່ວນ Call to Action */}
      <section className="bg-gray-50 border-t border-gray-100 py-24 px-6 relative overflow-hidden mt-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-400/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 tracking-tighter uppercase">
            {ctaTitle}
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href={`/${locale}/about/contact`} 
              className="bg-teal-600 hover:bg-teal-700 text-white font-black py-5 px-10 rounded-3xl transition-all shadow-xl shadow-teal-600/30 hover:-translate-y-1 uppercase tracking-[0.2em] text-lg"
            >
              {ctaBtn}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
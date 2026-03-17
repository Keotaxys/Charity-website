'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore';

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

        // 2. ດຶງລາຍຊື່ຜູ້ສະໜັບສະໜູນທັງໝົດສຳລັບ Logo (ລຽງຕາມການຕັ້ງຄ່າ order_index)
        const sponsorsQuery = query(collection(db, 'sponsors'), orderBy('order_index', 'asc'));
        const sponsorsSnap = await getDocs(sponsorsQuery);
        setSponsors(sponsorsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // 3. ດຶງ 5 ອັນດັບຍອດບໍລິຈາກສູງສຸດສຳລັບ Wall of Fame (ລຽງຕາມຍອດເງິນ)
        const topDonorsQuery = query(collection(db, 'sponsors'), orderBy('total_donation', 'desc'), limit(5));
        const topDonorsSnap = await getDocs(topDonorsQuery);
        setTopDonors(topDonorsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

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

  // ກຳນົດຄ່າ Fallback (ຖ້າບໍ່ມີຂໍ້ມູນ)
  const headerTitle = pageSettings ? (locale === 'lo' ? pageSettings.header_title_lo : pageSettings.header_title_en) : '';
  const headerSubtitle = pageSettings ? (locale === 'lo' ? pageSettings.header_subtitle_lo : pageSettings.header_subtitle_en) : '';
  
  const ctaTitle = pageSettings ? (locale === 'lo' ? pageSettings.cta_title_lo : pageSettings.cta_title_en) : '';
  const ctaBtn = pageSettings ? (locale === 'lo' ? pageSettings.cta_btn_lo : pageSettings.cta_btn_en) : 'BECOME A PARTNER';

  if (loading) {
    return <div className="min-h-screen flex flex-col items-center justify-center"><div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div><p className="mt-4 text-teal-600 font-bold">ກຳລັງໂຫຼດຂໍ້ມູນ...</p></div>;
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      
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

      {/* 2. ພາກສ່ວນ Top 5 (Wall of Fame) */}
      {topDonors.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase mb-4">
              {locale === 'lo' ? 'ທຳນຽບ 5 ອັນດັບຜູ້ສະໜັບສະໜູນ' : 'TOP 5 WALL OF FAME'}
            </h2>
            <div className="w-20 h-1 bg-teal-600 rounded-full mx-auto"></div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {topDonors.map((donor, index) => {
              const isFirst = index === 0;
              const displayName = locale === 'lo' ? donor.name_lo : donor.name_en;
              const amount = Number(donor.total_donation) || 0;

              let rankBadge = <span className="text-gray-400 font-black text-xl">#{index + 1}</span>;
              if (index === 0) rankBadge = <span className="text-3xl" title="Gold">🥇</span>;
              if (index === 1) rankBadge = <span className="text-3xl" title="Silver">🥈</span>;
              if (index === 2) rankBadge = <span className="text-3xl" title="Bronze">🥉</span>;

              return (
                <div 
                  key={donor.id} 
                  className={`flex items-center p-6 sm:p-8 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    isFirst ? 'bg-gradient-to-r from-yellow-50/50 to-white' : ''
                  }`}
                >
                  <div className="w-12 sm:w-16 flex justify-center items-center shrink-0">
                    {rankBadge}
                  </div>
                  
                  <div className="flex-1 px-4">
                    <h3 className={`font-bold sm:text-lg ${isFirst ? 'text-gray-900' : 'text-gray-700'}`}>
                      {displayName}
                    </h3>
                  </div>
                  
                  <div className="text-right shrink-0">
                    {amount > 0 ? (
                      <p className={`font-black tracking-wide ${isFirst ? 'text-teal-600 text-xl sm:text-2xl' : 'text-teal-600 text-lg sm:text-xl'}`}>
                        {amount.toLocaleString()} <span className="text-sm font-bold text-gray-400 uppercase">LAK</span>
                      </p>
                    ) : (
                      <p className="text-gray-400 italic font-medium text-sm sm:text-base bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                        {locale === 'lo' ? 'ບໍ່ເປີດເຜີຍຈຳນວນ' : 'Undisclosed'}
                      </p>
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
              className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-teal-600/50 uppercase tracking-wider text-lg"
            >
              {ctaBtn}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
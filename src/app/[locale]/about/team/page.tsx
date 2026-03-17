'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

export default function TeamPage() {
  const locale = useLocale();
  
  const [pageSettings, setPageSettings] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'settings', 'team_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setPageSettings(docSnap.data());

        const q = query(collection(db, 'team_members'), orderBy('order_index', 'asc'));
        const snap = await getDocs(q);
        setTeamMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const headerTitle = pageSettings ? (locale === 'lo' ? pageSettings.header_title_lo : pageSettings.header_title_en) : '';
  const headerSubtitle = pageSettings ? (locale === 'lo' ? pageSettings.header_subtitle_lo : pageSettings.header_subtitle_en) : '';
  
  const ctaTitle = pageSettings ? (locale === 'lo' ? pageSettings.cta_title_lo : pageSettings.cta_title_en) : '';
  const ctaDesc = pageSettings ? (locale === 'lo' ? pageSettings.cta_desc_lo : pageSettings.cta_desc_en) : '';
  const ctaBtn = pageSettings ? (locale === 'lo' ? pageSettings.cta_btn_lo : pageSettings.cta_btn_en) : 'JOIN THE TEAM';

  if (loading) {
    return <div className="min-h-screen flex flex-col items-center justify-center"><div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div><p className="mt-4 text-teal-600 font-bold">ກຳລັງໂຫຼດລາຍຊື່ທີມງານ...</p></div>;
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

      {/* 2. ລາຍຊື່ທີມງານ (Team Grid) */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {teamMembers.length === 0 ? (
          <p className="text-center text-gray-400 font-bold text-xl py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">ຍັງບໍ່ມີລາຍຊື່ທີມງານ</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {teamMembers.map((member) => (
              <div key={member.id} className="group text-center">
                <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-[2.5rem] bg-gray-100">
                  <img 
                    src={member.image_url} 
                    alt={member.name_en} 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 group-hover:text-teal-600 transition-colors">
                  {locale === 'lo' ? member.name_lo : member.name_en}
                </h3>
                <p className="text-pink-400 font-bold text-sm tracking-widest uppercase mt-2">
                  {locale === 'lo' ? member.position_lo : member.position_en}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. ສ່ວນຊວນມາເປັນອາສາສະໝັກ (Call to Action) */}
      <section className="bg-gray-50 border-t border-gray-100 py-24 px-6 relative overflow-hidden mt-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-400/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-teal-600 font-bold tracking-widest uppercase text-sm mb-4">
            {locale === 'lo' ? 'ຮ່ວມເປັນສ່ວນໜຶ່ງຂອງທີມ' : 'JOIN OUR MOVEMENT'}
          </h2>
          <h3 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 tracking-tighter">
            {ctaTitle}
          </h3>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {ctaDesc}
          </p>
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
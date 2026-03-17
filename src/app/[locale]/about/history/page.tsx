'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

export default function HistoryPage() {
  const locale = useLocale();
  
  const [pageSettings, setPageSettings] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ດຶງຂໍ້ມູນ Header ແລະ Footer
        const docRef = doc(db, 'settings', 'history_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setPageSettings(docSnap.data());

        // ດຶງຂໍ້ມູນ Timeline
        const q = query(collection(db, 'history_milestones'), orderBy('year', 'asc'));
        const snap = await getDocs(q);
        setMilestones(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching history data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const headerTitle = pageSettings ? (locale === 'lo' ? pageSettings.header_title_lo : pageSettings.header_title_en) : (locale === 'lo' ? 'ປະຫວັດຂອງພວກເຮົາ' : 'OUR HISTORY');
  const headerSubtitle = pageSettings ? (locale === 'lo' ? pageSettings.header_subtitle_lo : pageSettings.header_subtitle_en) : '';

  const footerSmall = pageSettings ? (locale === 'lo' ? pageSettings.footer_small_lo : pageSettings.footer_small_en) : '';
  const footerTitle = pageSettings ? (locale === 'lo' ? pageSettings.footer_title_lo : pageSettings.footer_title_en) : '';
  const footerDesc = pageSettings ? (locale === 'lo' ? pageSettings.footer_desc_lo : pageSettings.footer_desc_en) : '';
  const footerBtn = pageSettings ? (locale === 'lo' ? pageSettings.footer_btn_lo : pageSettings.footer_btn_en) : 'JOIN OUR CAUSE';

  if (loading) {
    return <div className="min-h-screen flex flex-col items-center justify-center"><div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div><p className="mt-4 text-teal-600 font-bold">ກຳລັງໂຫຼດປະຫວັດ...</p></div>;
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

      {/* 2. ສ່ວນ Timeline ເລົ່າປະຫວັດ */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        {milestones.length === 0 ? (
          <p className="text-center text-gray-400 font-bold text-xl py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">ຍັງບໍ່ມີຂໍ້ມູນປະຫວັດ</p>
        ) : (
          <div className="space-y-24">
            {milestones.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={item.id} className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                  
                  <div className="w-full md:w-1/2 relative group">
                    <div className={`absolute inset-0 rounded-[2.5rem] transform ${isEven ? 'translate-x-4 translate-y-4 bg-teal-100' : '-translate-x-4 translate-y-4 bg-pink-100'} z-0 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0`}></div>
                    <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-xl aspect-[4/3] bg-gray-100">
                      <img 
                        src={item.image} 
                        alt={locale === 'lo' ? item.title_lo : item.title_en} 
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-6 left-6 bg-white text-gray-900 font-black text-2xl py-2 px-6 rounded-2xl shadow-lg">
                        {item.year}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                      {locale === 'lo' ? item.title_lo : item.title_en}
                    </h3>
                    <div className="w-16 h-1 bg-teal-600 rounded-full mx-auto md:mx-0"></div>
                    <p className="text-lg text-gray-600 leading-relaxed pt-4">
                      {locale === 'lo' ? item.desc_lo : item.desc_en}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. ສ່ວນອະນາຄົດ (The Future) - ອັບເດດພື້ນຫຼັງສີເທົາອ່ອນ + Gradient */}
      <section className="bg-gray-50 border-t border-gray-100 py-24 px-6 relative overflow-hidden mt-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-400/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-teal-600 font-bold tracking-widest uppercase text-sm mb-4">
            {footerSmall}
          </h2>
          <h3 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter">
            {footerTitle}
          </h3>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {footerDesc}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href={`/${locale}/campaigns`}
              className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-teal-600/50 uppercase tracking-wider text-lg"
            >
              {footerBtn}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}